// Re-captures the project preview images used in src/projects/projects.jsx.
// Run manually whenever a project site changes: `npm run screenshot:projects`
// Keep this list in sync with src/projects/projectData.js.
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'projects');

// 16:10, matches the aspect-[16/10] frames in projects.jsx
const VIEWPORT = { width: 1440, height: 900 };

// Behälterreinigung Bayern sits behind a password gate on Vercel, so it is
// captured from its local static build (`npm run build` in that repo first).
const BEHAELTER_DIST = path.join(__dirname, '..', '..', 'behaelterreinigung-bayern', 'dist');

const projects = [
    { url: 'https://websbybenny.de', file: 'websbybenny.jpg', wait: 6000 },
    { url: 'https://portfolio.websbybenny.de/sportScorings', file: 'sportscorings.jpg' },
    { serve: BEHAELTER_DIST, file: 'behaelterreinigung.jpg' },
    { url: 'https://restaurant-template.websbybenny.de', file: 'tpl-gastronomie.jpg' },
    { url: 'https://praxis-template.websbybenny.de', file: 'tpl-praxis.jpg' },
    { url: 'https://handwerker-template.websbybenny.de', file: 'tpl-handwerk.jpg' },
    { url: 'https://einzelhandel-template.websbybenny.de', file: 'tpl-einzelhandel.jpg' },
    { url: 'https://fitness-template.websbybenny.de', file: 'tpl-fitness.jpg' },
    { url: 'https://beratung-template.websbybenny.de', file: 'tpl-beratung.jpg' },
];

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };

// minimal static server for a built site directory, resolves `/foo/` to `/foo/index.html`
function serveDir(dir) {
    const server = http.createServer((req, res) => {
        let p = decodeURIComponent(req.url.split('?')[0]);
        if (p.endsWith('/')) p += 'index.html';
        const file = path.join(dir, p);
        if (!file.startsWith(dir) || !fs.existsSync(file)) {
            res.writeHead(404);
            return res.end();
        }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
    });
    return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

async function screenshotProject(browser, project) {
    let server;
    let url = project.url;
    if (project.serve) {
        if (!fs.existsSync(project.serve)) {
            console.error(`  skipped ${project.file}: ${project.serve} not built`);
            return;
        }
        server = await serveDir(project.serve);
        url = `http://localhost:${server.address().port}/`;
    }
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
        if (server) server.close();
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
