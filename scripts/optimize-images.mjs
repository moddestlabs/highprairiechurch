import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const origDir = path.join(rootDir, 'originals', 'images');
const destDir = path.join(rootDir, 'public', 'images');

const force = process.argv.includes('--force');

async function optimizeImages() {
  if (!fs.existsSync(origDir)) {
    console.error(`Originals directory not found: ${origDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(origDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  console.log(`\n========================================`);
  console.log(` High Prairie Church - Image Optimizer`);
  console.log(` Source:      originals/images/ (${files.length} images)`);
  console.log(` Destination: public/images/`);
  console.log(` Force build: ${force ? 'Yes' : 'No'}`);
  console.log(`========================================\n`);

  let totalOrigBytes = 0;
  let totalDestBytes = 0;
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const srcPath = path.join(origDir, file);
    const destPath = path.join(destDir, file);
    const srcStat = fs.statSync(srcPath);

    totalOrigBytes += srcStat.size;

    // Check if we can skip when not forced
    if (!force && fs.existsSync(destPath)) {
      const destStat = fs.statSync(destPath);
      if (destStat.mtimeMs >= srcStat.mtimeMs) {
        totalDestBytes += destStat.size;
        skippedCount++;
        continue;
      }
    }

    const isPng = /\.png$/i.test(file);
    const isIcon = isPng && /^cropped-hpc-/i.test(file);
    const isStaff = /^Staff|^Pastor/i.test(file);

    let pipeline = sharp(srcPath);

    if (!isIcon) {
      const maxDim = isStaff ? 800 : 1600;
      pipeline = pipeline.resize(maxDim, maxDim, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    if (isPng) {
      pipeline = isIcon
        ? pipeline.png({ compressionLevel: 9, effort: 8 })
        : pipeline.png({ quality: 80, compressionLevel: 9, effort: 8 });
    } else {
      pipeline = pipeline.jpeg({
        quality: 82,
        mozjpeg: true,
        progressive: true,
      });
    }

    const optimizedBuffer = await pipeline.toBuffer();

    // Use whichever buffer is smaller
    if (optimizedBuffer.length < srcStat.size) {
      fs.writeFileSync(destPath, optimizedBuffer);
      totalDestBytes += optimizedBuffer.length;
      const savings = (((srcStat.size - optimizedBuffer.length) / srcStat.size) * 100).toFixed(1);
      console.log(
        `✓ [${file}] ${(srcStat.size / 1024).toFixed(0)} KB -> ${(optimizedBuffer.length / 1024).toFixed(0)} KB (-${savings}%)`
      );
    } else {
      fs.copyFileSync(srcPath, destPath);
      totalDestBytes += srcStat.size;
      console.log(`= [${file}] ${(srcStat.size / 1024).toFixed(0)} KB (already optimal)`);
    }

    processedCount++;
  }

  const overallSavings = totalOrigBytes > 0
    ? (((totalOrigBytes - totalDestBytes) / totalOrigBytes) * 100).toFixed(1)
    : '0';

  console.log(`\n----------------------------------------`);
  console.log(`Summary:`);
  console.log(` Processed: ${processedCount} | Skipped (up to date): ${skippedCount}`);
  console.log(` Originals Total: ${(totalOrigBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(` Public Web Total: ${(totalDestBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(` Overall Reduction: -${overallSavings}%`);
  console.log(`----------------------------------------\n`);
}

optimizeImages().catch(err => {
  console.error('Optimization failed:', err);
  process.exit(1);
});

