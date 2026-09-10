import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Handle system date skew
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load local .env
dotenv.config();

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME = 'edu-logos',
  PUBLIC_LOGOS_CDN_URL = 'https://logos.calculatorutility.tech'
} = process.env;

const PROCESSED_DIR = path.resolve(process.cwd(), 'data/processed-logos');
const CONCURRENCY_LIMIT = 20;

async function getExistingBucketKeys(s3, bucket) {
  const existingKeys = new Set();
  let continuationToken = undefined;

  try {
    do {
      const response = await s3.send(new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken
      }));

      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key) existingKeys.add(item.Key);
        }
      }
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  } catch (err) {
    console.warn(`⚠️ Note: Could not list existing objects in bucket (${err.message}). Will attempt upload of all files.`);
  }

  return existingKeys;
}

// Concurrency pool helper
async function runConcurrentPool(items, limit, handler) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = Promise.resolve().then(() => handler(item));
    results.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function uploadLogos() {
  console.log('☁️  Starting Cloudflare R2 High-Performance Logo Upload Pipeline...');

  // Validate credentials
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('\n❌ Missing Cloudflare R2 Credentials in .env file!');
    console.error('Please create or update your local .env file with:');
    console.error('   R2_ACCOUNT_ID=your_account_id');
    console.error('   R2_ACCESS_KEY_ID=your_token_access_key');
    console.error('   R2_SECRET_ACCESS_KEY=your_token_secret_key');
    console.error('   R2_BUCKET_NAME=edu-logos');
    console.error('   PUBLIC_LOGOS_CDN_URL=https://logos.calculatorutility.tech\n');
    process.exit(1);
  }

  // Ensure processed directory exists
  try {
    await fs.access(PROCESSED_DIR);
  } catch {
    console.error(`❌ Processed logos directory not found: ${PROCESSED_DIR}`);
    console.log('👉 Run "npm run process-logos" first to prepare the WebP images.');
    process.exit(1);
  }

  const files = await fs.readdir(PROCESSED_DIR);
  const webpFiles = files.filter(f => f.endsWith('.webp'));

  if (webpFiles.length === 0) {
    console.log(`ℹ️  No .webp images found in ${PROCESSED_DIR}`);
    console.log('👉 Run "npm run process-logos" first.');
    return;
  }

  console.log(`📡 Connecting to Cloudflare R2 (Bucket: ${R2_BUCKET_NAME})...`);
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    }
  });

  const existingKeys = await getExistingBucketKeys(s3, R2_BUCKET_NAME);
  console.log(`📦 Found ${existingKeys.size} files already in R2 bucket.`);

  const force = process.argv.includes('--force') || process.env.FORCE_UPLOAD === 'true';
  const toUpload = force ? webpFiles : webpFiles.filter(f => !existingKeys.has(f));
  const skippedCount = webpFiles.length - toUpload.length;

  console.log(`📋 Total files: ${webpFiles.length} | Mode: ${force ? 'FORCE OVERWRITE' : 'incremental'} | Skipped: ${skippedCount} | Pending upload: ${toUpload.length}`);

  if (toUpload.length === 0) {
    console.log('✅ All logos are already uploaded and in sync with R2!');
    return;
  }

  let uploadedCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  await runConcurrentPool(toUpload, CONCURRENCY_LIMIT, async (file) => {
    const filePath = path.join(PROCESSED_DIR, file);
    try {
      const fileBuffer = await fs.readFile(filePath);

      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: file,
        Body: fileBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
      }));

      uploadedCount++;
      if (uploadedCount % 25 === 0 || uploadedCount === toUpload.length) {
        const pct = ((uploadedCount / toUpload.length) * 100).toFixed(1);
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`⬆️  [${uploadedCount}/${toUpload.length}] (${pct}%) Uploaded in ${elapsedSec}s... Latest: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Upload failed for ${file}:`, err.message);
      errorCount++;
    }
  });

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n=======================================');
  console.log('🎉 R2 High-Speed Sync Complete!');
  console.log(`   Uploaded: ${uploadedCount} files in ${totalTimeSec}s`);
  console.log(`   Skipped:  ${skippedCount} (already up-to-date)`);
  console.log(`   Errors:   ${errorCount}`);
  console.log(`   CDN Base: ${PUBLIC_LOGOS_CDN_URL}`);
  console.log('=======================================\n');
}

uploadLogos().catch(err => {
  console.error('Fatal error in uploadLogos:', err);
  process.exit(1);
});
