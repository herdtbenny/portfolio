import ShowcasePage from '../showcase/showcasePage';

// Screenshots come from a local copy of the app running on demo data (no real
// recipes, photos or names). Files live in public/projects/kochbuch.
const SCREENS = [
    { src: '/projects/kochbuch/home.jpg', caption: 'Rezepte mit Fotos, Kategorie, Zeit und Bewertungen' },
    { src: '/projects/kochbuch/recipe.jpg', caption: 'Rezept mit „Heute gekocht“ und Merkliste' },
    { src: '/projects/kochbuch/recipe2.jpg', caption: 'Zutaten zum Abhaken beim Einkaufen und Kochen' },
    { src: '/projects/kochbuch/stats.jpg', caption: 'Statistik: Durchschnitte, Top 5 und größte Bewertungsunterschiede' },
    { src: '/projects/kochbuch/notify.jpg', caption: 'Rückblick „Seit du weg warst“ nach dem Öffnen' },
    { src: '/projects/kochbuch/login.jpg', caption: 'Login mit gemeinsamem Passwort und Personenauswahl' },
];

const FACTS = [
    { value: 'Im Alltag', label: 'privat genutzt, kein Demo-Projekt' },
    { value: '1 Tag', label: 'bis zur ersten Version' },
    { value: '37', label: 'Commits in 12 Tagen' },
    { value: 'PWA', label: 'auf dem iPhone-Homescreen' },
];

const FEATURES = [
    ['Bewertungen pro Person', 'Jede Person bewertet für sich von 1 bis 10. Daraus entstehen Durchschnitte, Top-5-Listen pro Kategorie und eine Liste der Gerichte mit den größten Unterschieden.'],
    ['Suche nach Zutaten', '„Was mache ich mit der Zucchini?“ – die Suche findet Gerichte auch über ihre Zutaten. Dazu Filter nach Kategorie und Sortierung nach Bewertung, Name oder Datum.'],
    ['Echte Push-Benachrichtigungen', 'Kommt ein Rezept oder eine Bewertung dazu, gibt es eine Web-Push-Nachricht aufs Handy. Beim Öffnen fasst ein Rückblick zusammen, was seit dem letzten Besuch passiert ist.'],
    ['Fotos ohne Wartezeit', 'Bilder werden schon im Browser verkleinert, bevor sie hochgeladen werden. So passen mehrere Fotos in einen Request und die App bleibt auch mobil schnell.'],
    ['Zufall & Merkliste', 'Ein Zufallsvorschlag aus den gut bewerteten Gerichten, ein TODO-Schalter für „demnächst kochen“ und ein Datum, wann es zuletzt auf dem Tisch stand.'],
];

const STACK = ['Next.js 16 (App Router)', 'Server Actions', 'TypeScript', 'Tailwind CSS 4', 'Drizzle ORM', 'Neon Postgres', 'Vercel Blob', 'Web Push', 'Service Worker', 'Claude Code'];

const DECISIONS = [
    ['Login ohne Bibliothek', 'Ein gemeinsames Passwort plus Personenauswahl. Das Session-Cookie wird mit HMAC-SHA256 über die Web Crypto API signiert und schon im Proxy geprüft, bevor eine Seite rendert.'],
    ['Schnell auf dem iPhone', 'Server in Frankfurt, Lade-Skelette statt leerer Seiten und kein Live-Blur beim Scrollen, weil Safari daran spürbar ruckelt.'],
    ['Privates bleibt privat', 'Hintergrundbild, Profilbilder und App-Icons liegen in Vercel Blob statt im Repository und werden erst nach dem Login ausgeliefert.'],
    ['Gebaut mit Claude Code', 'Von der ersten Version bis zu jedem Feedback-Wunsch: Planung, Umsetzung und Review liefen über Claude Code – inklusive Agent-Skills für die Neon-Datenbank.'],
];

const PROCESS = {
    title: 'Gebaut nach Feedback',
    intro: 'Die erste Version stand an einem Tag. Danach kam jede Änderung aus dem echten Gebrauch: Was im Alltag hakt, wird zeitnah umgesetzt und deployt. Ein paar Beispiele aus dem Verlauf:',
    items: [
        'Zubereitung als freies Textfeld statt starrer Einzelschritte, weil Rezepte aus dem Netz selten sauber gegliedert sind',
        'Server nach Frankfurt verlegt und Lade-Skelette ergänzt, nachdem die App auf dem iPhone träge wirkte',
        'Kein Auto-Zoom mehr beim Tippen in Formulare auf dem iPhone',
        'Rezepte wahlweise als Raster oder Liste, Trefferzahl direkt neben den Filtern',
    ],
};

function Kochbuch() {
    return (
        <ShowcasePage
            title="Kochbuch"
            kicker="Full-Stack · Web-App · 2026"
            headline={['Ein Kochbuch,', 'das wirklich genutzt wird.']}
            intro="Eine Web-App für den privaten Gebrauch: Rezepte mit Fotos, Bewertungen pro Person und Benachrichtigungen, wenn etwas Neues eingetragen wird. Kein Demo-Projekt, sondern ein Werkzeug für den Alltag, das mit jedem Feedback weiterwächst."
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

export default Kochbuch;
