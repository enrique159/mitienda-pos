import fs from 'fs';

if (fs.existsSync('dist')) {
  fs.rmdirSync('dist', { recursive: true });
}

if (fs.existsSync('build')) {
  fs.rmdirSync('build', { recursive: true });
}