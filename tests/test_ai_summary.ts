import assert from 'node:assert';
import { onRequestPost } from '../functions/api/generate-summary';
import { generateProfessionalSummary } from '../src/utils/ai/summary-service';

async function runAiSummaryTests() {
  console.log('====================================================');
  console.log('TESTING AI PROFESSIONAL SUMMARY & SERVERLESS PROXY');
  console.log('====================================================\n');

  // Test 1: Cloudflare Pages Function - Empty Input Handling
  console.log('--- Test 1: Cloudflare Pages Function: Empty Input Handling ---');
  const emptyReq = new Request('https://calculatorutility.tech/api/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '1.2.3.4' },
    body: JSON.stringify({}),
  });
  const emptyRes = await onRequestPost({ request: emptyReq, env: {} });
  const emptyJson: any = await emptyRes.json();
  assert.strictEqual(emptyRes.status, 400, 'Empty facts should return 400 Bad Request');
  assert.strictEqual(emptyJson.success, false, 'Empty facts should report success: false');
  console.log('  ✓ Correctly rejected empty facts with 400 and friendly error message:', emptyJson.error);

  // Test 2: Cloudflare Pages Function - Student / Fresher Summary Generation
  console.log('\n--- Test 2: Cloudflare Pages Function: Student / Fresher Payload ---');
  const studentPayload = {
    title: 'Junior Frontend Developer',
    education: [
      { degree: 'B.S. in Computer Science', field: 'Software Engineering', school: 'University of California, Berkeley', year: '2025' },
    ],
    skills: ['TypeScript', 'React', 'HTML/CSS', 'Git', 'Tailwind CSS'],
    projects: [
      { title: 'Interactive Calculator Suite', tech: 'TypeScript, Astro', description: 'Built client-side calculators' },
    ],
  };

  const studentReq = new Request('https://calculatorutility.tech/api/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '1.2.3.5' },
    body: JSON.stringify(studentPayload),
  });
  const studentRes = await onRequestPost({ request: studentReq, env: {} });
  const studentJson: any = await studentRes.json();
  assert.strictEqual(studentRes.status, 200, 'Valid student facts should return 200 OK');
  assert.strictEqual(studentJson.success, true, 'Student generation should succeed');
  assert(studentJson.summary.length > 30, 'Generated summary should be a complete sentence');
  assert(!studentJson.summary.includes('**'), 'Summary should contain zero markdown asterisks');
  assert(!studentJson.summary.includes('🤖'), 'Summary should contain zero emojis');
  console.log('  ✓ Generated Student Summary (Provider: ' + studentJson.provider + '):');
  console.log('    "' + studentJson.summary + '"');

  // Test 3: Cloudflare Pages Function - Experienced Professional Payload
  console.log('\n--- Test 3: Cloudflare Pages Function: Experienced Professional Payload ---');
  const proPayload = {
    title: 'Senior DevOps & Cloud Architect',
    experience: [
      {
        role: 'Lead Cloud Infrastructure Engineer',
        company: 'ScaleGrid Systems',
        duration: '2021 - Present',
        description: 'Architected multi-region Kubernetes clusters and automated CI/CD pipelines reducing deployment times by 65%.',
      },
    ],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD', 'Go', 'Prometheus'],
  };

  const proReq = new Request('https://calculatorutility.tech/api/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '1.2.3.6' },
    body: JSON.stringify(proPayload),
  });
  const proRes = await onRequestPost({ request: proReq, env: {} });
  const proJson: any = await proRes.json();
  assert.strictEqual(proRes.status, 200, 'Valid pro facts should return 200 OK');
  assert.strictEqual(proJson.success, true, 'Pro generation should succeed');
  console.log('  ✓ Generated Pro Summary (Provider: ' + proJson.provider + '):');
  console.log('    "' + proJson.summary + '"');

  // Test 4: Cloudflare Pages Function - Cooldown Protection Test (Rapid second call with same IP)
  console.log('\n--- Test 4: Cloudflare Pages Function: Anti-Spam Rapid Request Cooldown ---');
  const rapidReq = new Request('https://calculatorutility.tech/api/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '1.2.3.6' },
    body: JSON.stringify(proPayload),
  });
  const rapidRes = await onRequestPost({ request: rapidReq, env: {} });
  const rapidJson: any = await rapidRes.json();
  assert.strictEqual(rapidRes.status, 429, 'Rapid duplicate call within cooldown should return 429');
  assert.strictEqual(rapidJson.isRateLimited, true, 'isRateLimited flag should be true');
  console.log('  ✓ Correctly triggered 429 cooldown protection:', rapidJson.error);

  // Test 5: Client-Side Service Abstraction (Fallback / Offline verification)
  console.log('\n--- Test 5: Client-Side Service Abstraction Fallback ---');
  const clientResult = await generateProfessionalSummary(studentPayload);
  assert.strictEqual(clientResult.success, true, 'Client service should succeed');
  assert(clientResult.summary.length > 30, 'Client summary should produce non-empty text');
  console.log('  ✓ Client service fallback produced valid summary:');
  console.log('    "' + clientResult.summary + '"');

  console.log('\n====================================================');
  console.log('ALL AI PROFESSIONAL SUMMARY & RATE-LIMIT TESTS PASSED!');
  console.log('====================================================');
}

runAiSummaryTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
