const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function smoothScroll(page, targetY, durationMs = 2000) {
  const steps = 30;
  const stepTime = durationMs / steps;
  const currentY = await page.evaluate(() => window.scrollY);
  const diff = targetY - currentY;

  for (let i = 1; i <= steps; i++) {
    const y = currentY + (diff * (i / steps));
    await page.evaluate((scrollPos) => window.scrollTo(0, scrollPos), y);
    await page.waitForTimeout(stepTime);
  }
}

async function run() {
  const videoDir = path.join(__dirname, '..', 'docs', 'videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log('🚀 Launching Chrome recorder (1280x720 HD)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  console.log('🎬 [0:00 - 0:16] Scene 1: Landing Page Showcase...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await smoothScroll(page, 700, 3000);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 1400, 3000);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 0, 2000);
  await page.waitForTimeout(1500);

  console.log('🎬 [0:16 - 0:36] Scene 2: Today Overview & Environment Selector...');
  await page.goto('http://localhost:3000/today', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  // Hover on domain cards
  await page.mouse.move(300, 350);
  await page.waitForTimeout(1500);
  await page.mouse.move(600, 350);
  await page.waitForTimeout(1500);
  await smoothScroll(page, 500, 2500);
  await page.waitForTimeout(2500);
  await smoothScroll(page, 0, 1500);
  await page.waitForTimeout(1000);

  // Click Environment selector in top bar if present
  try {
    const envButton = await page.$('button:has-text("Spacecraft"), button:has-text("Station"), button:has-text("Mars")');
    if (envButton) {
      await envButton.click();
      await page.waitForTimeout(2000);
      // Click Mars Surface Base
      const marsOption = await page.$('button:has-text("Mars Surface Base")');
      if (marsOption) {
        await marsOption.click();
        await page.waitForTimeout(2500);
      }
    }
  } catch (err) {
    console.log('Env switch note:', err.message);
  }

  console.log('🎬 [0:36 - 0:56] Scene 3: Interactive Human Body & Hazard Lens...');
  await page.goto('http://localhost:3000/body', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Click on Brain/Head
  try {
    const brain = await page.$('svg path[id*="brain"], svg circle[id*="brain"], [data-part="brain"], svg g');
    if (brain) {
      await brain.click({ force: true });
      await page.waitForTimeout(2500);
    }
  } catch (e) {}

  // Toggle Hazard Lens (Radiation)
  try {
    const radLens = await page.$('button:has-text("Radiation"), button:has-text("রেডিয়েশন")');
    if (radLens) {
      await radLens.click();
      await page.waitForTimeout(2500);
    }
    const gravLens = await page.$('button:has-text("Gravity"), button:has-text("গ্র্যাভিটি")');
    if (gravLens) {
      await gravLens.click();
      await page.waitForTimeout(2500);
    }
  } catch (e) {}
  await smoothScroll(page, 300, 1500);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 0, 1000);

  console.log('🎬 [0:56 - 1:16] Scene 4: Clinical Guidance Decision Tree...');
  await page.goto('http://localhost:3000/guidance', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  // Interact with Guidance Wizard
  try {
    const startBtn = await page.$('button:has-text("Start Diagnosis"), button:has-text("নতুন ডায়াগনসিস")');
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }
    const optionBtn = await page.$('button:has-text("Blood Pressure"), button:has-text("Headache"), button:has-text("Cardio"), button:has-text("Yes"), button:has-text("Next")');
    if (optionBtn) {
      await optionBtn.click();
      await page.waitForTimeout(2500);
    }
  } catch (e) {}
  await smoothScroll(page, 400, 2000);
  await page.waitForTimeout(3000);
  await smoothScroll(page, 0, 1000);

  console.log('🎬 [1:16 - 1:32] Scene 5: Daily Routine & Ultrasound Scanner...');
  await page.goto('http://localhost:3000/routine', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  // Check a checklist item
  try {
    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      await checkbox.click();
      await page.waitForTimeout(1500);
    }
    // Launch ultrasound modal
    const scanBtn = await page.$('button:has-text("Ultrasound"), button:has-text("Capture"), button:has-text("Scanner")');
    if (scanBtn) {
      await scanBtn.click();
      await page.waitForTimeout(3000);
      // Draw a circle on canvas
      const canvas = await page.$('canvas');
      if (canvas) {
        const box = await canvas.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 30);
          await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 60);
          await page.mouse.up();
          await page.waitForTimeout(2000);
        }
      }
      const closeBtn = await page.$('button:has-text("Close"), button:has-text("Cancel"), button:has-text("Save")');
      if (closeBtn) {
        await closeBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  } catch (e) {}

  console.log('🎬 [1:32 - 1:46] Scene 6: Gamification, Streaks & Lore Badges...');
  await page.goto('http://localhost:3000/progress', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await smoothScroll(page, 400, 2500);
  await page.waitForTimeout(3000);
  await smoothScroll(page, 0, 1500);

  console.log('🎬 [1:46 - 2:02] Scene 7: Radiation Watch & Flight Surgeon Dossier...');
  await page.goto('http://localhost:3000/radiation', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await smoothScroll(page, 350, 2000);
  await page.waitForTimeout(2500);

  await page.goto('http://localhost:3000/report', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await smoothScroll(page, 500, 2500);
  await page.waitForTimeout(3000);

  console.log('🏁 Concluding recording session...');
  await context.close();
  await browser.close();

  // Find generated webm file and rename it to a clean name
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestFile = files.sort((a, b) => {
      return fs.statSync(path.join(videoDir, b)).mtimeMs - fs.statSync(path.join(videoDir, a)).mtimeMs;
    })[0];
    const finalName = 'astra_loop_2min_demo.webm';
    const finalPath = path.join(videoDir, finalName);
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    fs.renameSync(path.join(videoDir, latestFile), finalPath);
    const stats = fs.statSync(finalPath);
    console.log(`✅ SUCCESS: Screen recording saved at docs/videos/${finalName} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  }
}

run().catch((err) => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});

