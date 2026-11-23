import fs from 'node:fs';

const content = JSON.parse(fs.readFileSync('data/course-content.json','utf8'));
const key = content.exam.map(q => q.a);
if (key.length !== 20 || key.some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Invalid assessment key');
const serialized = JSON.stringify(key) + '\n';
if (process.argv.includes('--check')) {
  const stored = JSON.parse(fs.readFileSync('data/answer-key.json','utf8'));
  if (JSON.stringify(stored) !== JSON.stringify(key)) throw new Error('Run npm run prepare:answers to synchronize the server key');
  console.log('Browser and server answer keys match.');
} else {
  fs.writeFileSync('data/answer-key.json',serialized);
  console.log('Updated only data/answer-key.json.');
}
