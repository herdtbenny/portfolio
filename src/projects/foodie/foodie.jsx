import ShowcasePage from '../showcase/showcasePage';

// Screenshots come from a local copy of the app on an in-memory database (PGlite) with
// invented restaurants, ratings and people. Files live in public/projects/foodie.
const SCREENS = [
    { src: '/projects/foodie/bisherige.jpg', caption: 'Besuchte Restaurants mit Gesamtnote und den Noten beider Personen' },
    { src: '/projects/foodie/restaurant.jpg', caption: 'Restaurant mit Karte, Küche, Preisstufe und Bewertung pro Kategorie' },
    { src: '/projects/foodie/restaurant2.jpg', caption: 'Was jede Person gegessen hat, mit Foto, dazu gemeinsame Notizen' },
    { src: '/projects/foodie/karte.jpg', caption: 'Alle Einträge auf der Karte, eingefärbt nach Gesamtnote' },
    { src: '/projects/foodie/heute.jpg', caption: '„Wohin heute?“: Würfeln nach Küche und Liste, dazu die Top 5' },
    { src: '/projects/foodie/kategorien.jpg', caption: 'Bewertungs-Kategorien mit gemeinsamer Gewichtung in Prozent' },
];

const FACTS = [
    { value: '1 Abend', label: 'von der ersten Zeile bis zur fertigen App' },
    { value: '29', label: 'Commits, alle mit Claude Code' },
    { value: '2', label: 'Personen, jede mit eigenen Noten' },
    { value: 'PWA', label: 'auf dem iPhone-Homescreen' },
];

const FEATURES = [
    ['Wunschliste & Bisherige', 'Restaurants, in die man mal will, und solche, in denen man schon war – mit Suche, Filter nach Küche und Sortierung nach Note, auch nach den Favoriten jeder Person.'],
    ['Bewertung nach Kategorien', 'Jede Person bewertet Geschmack, Preis-Leistung, Ambiente und eigene Kategorien von 1 bis 10. Die Gesamtnote ist ein gewichteter Schnitt, die Gewichtung legt man gemeinsam fest.'],
    ['Ein Link statt Formular', 'Google-Maps-Link einfügen – auch Kurzlinks oder den geteilten Text vom iPhone – und Name, Adresse und Position werden übernommen. Fehlen Koordinaten, sucht die App die Adresse über OpenStreetMap.'],
    ['Karte mit allen Einträgen', 'Leaflet und OpenStreetMap zeigen jedes Restaurant als Pin, eingefärbt auf einem Notenstrahl von 1 bis 10, filterbar nach Besucht und Wunschliste.'],
    ['Wohin heute?', 'Wer sich nicht entscheiden kann, würfelt: aus den bisherigen, der Wunschliste oder beidem, auf Wunsch nur eine bestimmte Küche. Darunter stehen die fünf besten Restaurants.'],
    ['Push & Rückblick', 'Trägt die andere Person etwas ein oder bewertet, kommt eine Web-Push-Nachricht. Beim Öffnen fasst ein Rückblick zusammen, was seit dem letzten Besuch passiert ist.'],
];

const STACK = ['Next.js 16 (App Router)', 'Server Actions', 'TypeScript', 'Tailwind CSS 4', 'Drizzle ORM', 'Neon Postgres', 'Leaflet', 'OpenStreetMap', 'Vercel Blob', 'Web Push', 'Claude Code'];

const DECISIONS = [
    ['Schwester-App vom Kochbuch', 'Gleicher Stack und gleiche Bausteine wie beim Kochbuch – gemeinsames Passwort mit Personenauswahl, Web Push, Fotos in Vercel Blob –, aber mit eigener Datenbank und eigenen Daten.'],
    ['Gewichtung statt Durchschnitt', 'Die Gesamtnote ist ein gewichteter Schnitt der Kategorien, in 5er-Schritten auf 100 % verteilt. Wird bestellt statt vor Ort gegessen, zählen Kategorien wie Ambiente nicht mit.'],
    ['Login mit Ablaufdatum', 'Ein gemeinsames Passwort, das sich jedes Gerät 30 Tage merkt: Das Ablaufdatum steckt im Cookie und ist mit HMAC über die Web Crypto API mitsigniert. Geprüft wird schon im Proxy, vor jeder Seite.'],
    ['Weniger Felder, mehr Link', 'Ein Adressfeld gab es anfangs, es flog raus: Der Google-Maps-Link liefert Name, Adresse und Koordinaten, die Eingabe eines neuen Restaurants ist damit ein einziges Einfügen.'],
];

const PROCESS = {
    title: 'Ein Abend, viele Runden',
    intro: '28 der 29 Commits entstanden an einem einzigen Abend, zwischen 21:43 und 23:21 Uhr. Gerade das Design ging dabei durch mehrere Runden, bis es im Alltag passte:',
    items: [
        'Vom orangen Verlauf über eine Retro-Diner-Schrift und Liquid-Glass-Navigation zu einem schlichten Look mit Bricolage Grotesque',
        'Detail- und Bearbeiten-Seite zusammengelegt, Küche und Preis als Chips direkt unter dem Namen',
        'Kein Adressfeld mehr, alles über Google-Maps-Links',
        'Bewertung als Slider, Preisstufen €–€€€, Vollbild-Karte mit Notenstrahl als Legende',
    ],
};

function Foodie() {
    return (
        <ShowcasePage
            title="Foodie"
            kicker="Full-Stack · Web-App · 2026"
            headline={['Wo gehen wir', 'als Nächstes essen?']}
            intro="Eine Restaurant-App für zwei: Wunschliste, Bewertungen nach Kategorien – jede Person für sich – und eine Karte mit allen Einträgen. Gebaut als Schwester-App zum Kochbuch, mit eigener Datenbank."
            facts={FACTS}
            screens={SCREENS}
            screenSize={[786, 1704]}
            features={FEATURES}
            stack={STACK}
            decisions={DECISIONS}
            process={PROCESS}
        />
    );
}

export default Foodie;
