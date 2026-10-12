// Projects shown in <Projects>, in display order. Images live in
// public/projects and are re-captured by scripts/screenshot-projects.js —
// keep both lists in sync.
// `href` starting with "/" is an in-app route, anything else opens in a new tab.

export const PROJECTS = [
    {
        id: 'websbybenny',
        title: 'Webs by Benny',
        kind: 'Eigene Webagentur',
        period: 'seit 2026',
        status: 'Live',
        image: '/projects/websbybenny.jpg',
        href: 'https://websbybenny.de',
        linkLabel: 'websbybenny.de',
        summary:
            'Meine eigene Webagentur für lokale Betriebe in Regensburg: von der Akquise über Design und Entwicklung bis zur Betreuung nach dem Launch, alles aus einer Hand.',
        highlights: [
            'Sechs Branchen-Templates als Startpunkt für jede Kunden-Demo',
            'Internes Akquise-Dashboard mit Supabase',
            'Zweisprachig, Dark Mode, vorgerenderte Seiten',
        ],
        stack: ['React', 'Tailwind', 'Framer Motion', 'Supabase', 'Vercel'],
        accent: '#e6a558',
    },
    {
        id: 'behaelterreinigung',
        title: 'Behälterreinigung Bayern',
        kind: 'Kundenprojekt',
        period: '2026',
        status: 'Launch in Kürze',
        image: '/projects/behaelterreinigung.jpg',
        summary:
            'Website für einen Mülltonnen-Service in Ostbayern, ausgerichtet auf Hausverwaltungen und Kommunen. Eigene Landingpage pro Einsatzgebiet für lokales SEO.',
        highlights: [
            'Acht Regionsseiten, Sitemap, llms.txt',
            'Passwortschutz per Edge-Middleware bis zum Livegang',
        ],
        stack: ['Astro', 'TypeScript', 'Tailwind', 'Vercel'],
        accent: '#3b82f6',
    },
    {
        id: 'sportscorings',
        title: 'Sport Scorings',
        kind: 'Side Project',
        period: '2026',
        status: 'Live',
        image: '/projects/sportscorings.jpg',
        href: '/sportScorings',
        linkLabel: 'Projekt öffnen',
        summary:
            'Live-Tabellen, Spieltage, Torjäger und Teamsuche für Bundesliga, Premier League und weitere Wettbewerbe, gespeist aus der OpenLigaDB API.',
        highlights: [
            'Saison- und Ligawahl mit Caching der Ligaliste',
            'Eigene Ansicht für Tabelle, Spieltag und Torjäger',
        ],
        stack: ['React', 'REST API', 'Tailwind'],
        accent: '#34d399',
    },
];

// the six demo templates behind Webs by Benny, shown as a strip under its spread
export const TEMPLATES = [
    { name: 'Gastronomie', url: 'https://restaurant-template.websbybenny.de', image: '/projects/tpl-gastronomie.jpg' },
    { name: 'Arztpraxis', url: 'https://praxis-template.websbybenny.de', image: '/projects/tpl-praxis.jpg' },
    { name: 'Handwerk', url: 'https://handwerker-template.websbybenny.de', image: '/projects/tpl-handwerk.jpg' },
    { name: 'Einzelhandel', url: 'https://einzelhandel-template.websbybenny.de', image: '/projects/tpl-einzelhandel.jpg' },
    { name: 'Fitness', url: 'https://fitness-template.websbybenny.de', image: '/projects/tpl-fitness.jpg' },
    { name: 'Beratung', url: 'https://beratung-template.websbybenny.de', image: '/projects/tpl-beratung.jpg' },
];
