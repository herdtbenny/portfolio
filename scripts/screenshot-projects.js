// Re-captures the project preview images used in src/projects/projects.jsx.
// Run manually whenever a project site changes: `npm run screenshot:projects`
// Keep this list in sync with src/projects/projectData.js.
// Exception: kochbuch.jpg and public/projects/kochbuch/* are captured from a local copy of the
// private app running on demo data, so they are not part of this script.
// Pass file names to re-capture only those: `npm run screenshot:projects -- websbybenny.jpg`
// Pass --local to capture the portfolio pages from ./build instead of production (run
// `npm run build` first). Files are served straight from disk through Playwright, no server needed.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'projects');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const PROD_ORIGIN = 'https://portfolio.websbybenny.de';
const LOCAL = process.argv.includes('--local');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.txt': 'text/plain' };

// answers requests for the portfolio origin from ./build, with index.html as SPA fallback
async function serveBuild(page) {
    await page.route(`${PROD_ORIGIN}/**`, async (route) => {
        const { pathname } = new URL(route.request().url());
        let file = path.join(BUILD_DIR, decodeURIComponent(pathname));
        if (!file.startsWith(BUILD_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
            file = path.join(BUILD_DIR, 'index.html');
        }
        await route.fulfill({ body: fs.readFileSync(file), contentType: MIME[path.extname(file)] || 'application/octet-stream' });
    });
}

// 16:10, matches the aspect-[16/10] frames in projects.jsx
const VIEWPORT = { width: 1440, height: 900 };

const projects = [
    // a stored "nothing optional" choice keeps the cookie banner out of the shot
    // (key and version as in websbybenny's src/consent/consent.jsx)
    { url: 'https://websbybenny.de', file: 'websbybenny.jpg', wait: 6000, consent: { key: 'wbb-consent', value: { v: 3, statistics: false } } },
    { url: 'https://portfolio.websbybenny.de/sportScorings', file: 'sportscorings.jpg' },
    { url: 'https://portfolio.websbybenny.de/xg-lab', file: 'xglab.jpg' },
    { url: 'https://portfolio.websbybenny.de/finance-tracker', file: 'finanztracker.jpg' },
    { url: 'https://portfolio.websbybenny.de/auth-rollen-system', file: 'rbac.jpg' },
];

async function screenshotProject(browser, project) {
    const { url } = project;
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1.5 });
    try {
        if (project.consent) {
            await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), project.consent);
        }
        if (LOCAL) {
            if (!url.startsWith(PROD_ORIGIN)) {
                console.log(`- skipping ${url} (not part of this build)`);
                return;
            }
            await serveBuild(page);
        }
        console.log(`→ ${url}${LOCAL ? ' (local build)' : ''}`);
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
        const only = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
        for (const project of projects.filter((p) => !only.length || only.includes(p.file))) {
            await screenshotProject(browser, project);
        }
    } finally {
        await browser.close();
    }
}

main();
