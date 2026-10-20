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
        summary: 'Meine eigene Webagentur für lokale Betriebe in Regensburg.',
        accent: '#e6a558',
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
        summary: 'Live-Tabellen, Spieltage und Torjäger für Bundesliga, Premier League und mehr.',
        accent: '#34d399',
    },
];
