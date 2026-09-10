import fs from 'node:fs';

async function searchFiles(term) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(term) + '&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)' } });
  const data = await res.json();
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages).map(p => ({ title: p.title, url: p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url }));
}

async function run() {
  console.log('IIUC:', await searchFiles('International Islamic University Chittagong'));
  console.log('Barishal:', await searchFiles('University of Barishal'));
  console.log('Barisal:', await searchFiles('University of Barisal'));
  console.log('IU Kushtia:', await searchFiles('Islamic University Bangladesh logo'));
  console.log('BSMMU:', await searchFiles('Bangabandhu Sheikh Mujib Medical University'));
}

run();
