import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\b29215f2-b897-44c8-9aec-0e2bc989f276';
const destDir = 'C:\\Users\\Usuario\\Desktop\\PROYECTOS\\De Viaje por Marruecos\\marruecos-experiencia\\public\\images\\blog';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = {
  'blog_marrakech_1774878087462.png': 'marrakech.png',
  'blog_desert_1774878102786.png': 'desert.png',
  'blog_food_1774878118648.png': 'food.png',
  'blog_riad_1774878136325.png': 'riad.png',
  'blog_chefchaouen_1774878155707.png': 'chefchaouen.png',
  'blog_tips_1774878171994.png': 'tips.png'
};

for (const [srcFile, destFile] of Object.entries(filesToCopy)) {
  try {
    fs.copyFileSync(path.join(srcDir, srcFile), path.join(destDir, destFile));
    console.log(`Copied ${srcFile} to ${destFile}`);
  } catch (err) {
    console.error(`Failed to copy ${srcFile}:`, err);
  }
}
