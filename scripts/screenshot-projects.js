// Re-captures the project preview images used in src/projects/projects.jsx.
// Run manually whenever a project site changes: `npm run screenshot:projects`
// Keep this list in sync with src/projects/projectData.js.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'projects');

// 16:10, matches the aspect-[16/10] frames in projects.jsx
const VIEWPORT = { width: 1440, height: 900 };

const projects = [
    { url: 'https://websbybenny.de', file: 'websbybenny.jpg', wait: 6000 },
    { url: 'https://portfolio.websbybenny.de/sportScorings', file: 'sportscorings.jpg' },
];

async function screenshotProject(browser, project) {
    const { url } = project;
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1.5 });
    try {
        console.log(`→ ${url}`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        // let entrance animations/fonts settle before capturing
        await page.waitForTimeout(project.wait || 1500);
        const outPath = path.join(OUTPUT_DIR, project.file);
        await page.screenshot({ path: outPath, type: 'jpeg', quality: 80 });
        console.log(`  saved ${path.relative(process.cwd(), outPath)}`);
    } catch (err) {
        console.error(`  failed for ${url}: ${err.message}`);
    } finally {
        await page.close();
    }
}

async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await chromium.launch();
    try {
        for (const project of projects) {
            await screenshotProject(browser, project);
        }
    } finally {
        await browser.close();
    }
}

main();
