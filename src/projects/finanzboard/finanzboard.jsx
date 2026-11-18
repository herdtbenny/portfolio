import ShowcasePage from '../showcase/showcasePage';

// Screenshots come from the real build running on invented demo data: every /api call is
// answered locally, so no real accounts or amounts are shown. Files live in public/projects/finanzboard.
const SCREENS = [
    { src: '/projects/finanzboard/uebersicht.jpg', caption: 'Übersicht: Gesamtvermögen über 12 Monate, Konten und der laufende Monat' },
    { src: '/projects/finanzboard/umsaetze.jpg', caption: 'Umsätze nach Tag, filterbar nach Monat, Konto und Richtung' },
    { src: '/projects/finanzboard/analyse.jpg', caption: 'Analyse: Einnahmen und Ausgaben im Verlauf, Ausgaben nach Kategorie' },
    { src: '/projects/finanzboard/formular.jpg', caption: 'Neuer Umsatz mit Kassenzettel-Scan, Kategorie-Vorschlag und Wiederholung' },
    { src: '/projects/finanzboard/konten.jpg', caption: 'Konten, eigene Kategorien und Personen mit getrennten Daten' },
    { src: '/projects/finanzboard/login.jpg', caption: 'Login mit Name und Passwort, Sperre nach Fehlversuchen' },
];

const FACTS = [
    { value: 'Im Alltag', label: 'ersetzt meine frühere Finanz-App' },
    { value: '51', label: 'Commits in 10 Tagen' },
    { value: 'Ohne Bank', label: 'alles selbst eingetragen, keine Kontoanbindung' },
    { value: 'PWA', label: 'auf dem iPhone-Homescreen' },
];

const FEATURES = [
    ['Kassenzettel scannen', 'Ein Foto vom Zettel genügt: Die Texterkennung läuft mit Tesseract.js direkt im Browser, ein eigener Parser holt Betrag, Datum und Händler heraus und füllt das Formular vor. Das Foto verlässt das Gerät nicht.'],
    ['Kategorien, die mitdenken', 'Beim Tippen schlägt die App eine Kategorie vor – über Stichwort-Regeln (REWE → Lebensmittel) und über die eigene Historie: Was bei einem Händler zuletzt gewählt wurde, kommt zuerst.'],
    ['Daueraufträge & Vorgemerktes', 'Miete, Abos oder das monatliche Sparen werden 31 Tage im Voraus gebucht und zählen erst an ihrem Tag zum Kontostand. Ein täglicher Cron-Job hält das aktuell, auch wenn die App geschlossen bleibt.'],
    ['Umbuchungen & Kontoauszug', 'Geld zwischen eigenen Konten wird als zwei verknüpfte Buchungen gespeichert und als eine Zeile gezeigt. Gefiltert nach einem Konto wird die Liste zum Kontoauszug mit laufendem Stand.'],
    ['Der Monat auf einen Blick', 'Einnahmen, Ausgaben, die größten Posten und wie viel übrig bleibt – dazu der Vermögensverlauf über zwölf Monate und der Vergleich mit den Vormonaten.'],
];

const STACK = ['React 19', 'Vite', 'Tailwind CSS 4', 'Vercel Functions', 'Supabase (Postgres)', 'Tesseract.js', 'PWA', 'Cron Jobs', 'Claude Code'];

const DECISIONS = [
    ['Login ohne Bibliothek', 'Passwörter als scrypt-Hash, Sitzungen als HMAC-signierte Tokens, die sich bei jeder Nutzung erneuern. Nach 7 Tagen ohne Nutzung ist man abgemeldet, nach 5 Fehlversuchen ist der Login 15 Minuten gesperrt.'],
    ['Jede Person sieht nur ihre Daten', 'Konten, Umsätze und Kategorien tragen eine user_id, und jede API-Route liest und schreibt nur die Daten der angemeldeten Person. Der Datenbank-Schlüssel bleibt auf dem Server, ein Passwortwechsel beendet alle anderen Sitzungen.'],
    ['Salden aus der Historie', 'Der Kontostand wird nicht gespeichert, sondern im Browser aus Anfangssaldo und allen gebuchten Umsätzen berechnet. Vorgemerktes läuft getrennt mit, so stimmt der Stand immer mit der Liste überein.'],
    ['Umzug aus der alten App', 'Ein Import-Skript liest das Backup-Format meiner früheren Finanz-App und übernimmt Konten, Umsätze, Kategorien und Daueraufträge. Es lässt sich gefahrlos wiederholen, weil die IDs aus den Datensätzen abgeleitet werden.'],
];

const PROCESS = {
    title: 'Gebaut nach Gebrauch',
    intro: '45 der 51 Commits entstanden am ersten Tag, alle mit Claude Code. Danach kam jede Änderung aus dem täglichen Eintragen: Was hakt, wird umgesetzt und direkt deployt. Ein paar Beispiele aus dem Verlauf:',
    items: [
        'Gestartet mit automatischem Kontoabruf über Enable Banking – noch am selben Vormittag auf manuelles Eintragen umgestellt',
        'Von gemeinsamen Haushalten auf eigene Daten pro Person umgebaut – mit Login-Sperre und Abmelden bei Passwortwechsel',
        'Vercel-Funktionen nach Frankfurt verlegt, nah an der Datenbank',
        'Beträge immer mit Cent, nie gerundet',
        'Animationen reduziert: kein gestaffeltes Einblenden mehr, kürzerer Tab-Wechsel',
    ],
};

function Finanzboard() {
    return (
        <ShowcasePage
            title="Finanzboard"
            kicker="Full-Stack · Web-App · 2026"
            headline={['Ein Haushaltsbuch,', 'das ich wirklich nutze.']}
            intro="Eine mobiloptimierte Web-App für die eigenen Finanzen: Konten, Umsätze und Daueraufträge trage ich selbst ein, ganz ohne Bankverbindung. Sie hat meine frühere Finanz-App abgelöst, läuft auf Vercel mit Supabase als Datenbank und liegt als App auf dem Homescreen."
            facts={FACTS}
            screens={SCREENS}
            screenSize={[786, 1709]}
            features={FEATURES}
            stack={STACK}
            decisions={DECISIONS}
            process={PROCESS}
        />
    );
}

export default Finanzboard;
