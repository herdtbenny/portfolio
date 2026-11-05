import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import useInView from '../../hooks/useInView';
import RevealLine from '../../components/revealLine';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

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

const label = 'm-0 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500';

function Section({ kicker, title, children }) {
    const [ref, inView] = useInView();
    return (
        <section ref={ref} className="border-t border-ink/10 py-14 sm:py-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                    <p className={`${label} mb-3`} style={fadeUp(inView)}>{kicker}</p>
                    <h2 className="m-0 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                        <RevealLine inView={inView} delay={80}>{title}</RevealLine>
                    </h2>
                </div>
                <div className="lg:col-span-8" style={fadeUp(inView, 0.15)}>{children}</div>
            </div>
        </section>
    );
}

function Kochbuch() {
    const [ref, inView] = useInView();

    return (
        <div className="min-h-screen bg-cream font-serif text-ink">
            <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-cream/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-5 py-4 sm:px-12">
                    <Link
                        to="/#projects"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/10 text-stone-600 no-underline transition-colors hover:bg-ink/[0.05] hover:text-ink"
                        title="Zurück zum Portfolio"
                        aria-label="Zurück zum Portfolio"
                    >
                        <FiArrowLeft />
                    </Link>
                    <p className="m-0 truncate text-base font-semibold tracking-tight">Kochbuch</p>
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-600">
                        <FiLock /> Privat
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-12">
                <div ref={ref} className="pb-14 pt-16 sm:pb-20 sm:pt-24">
                    <p className={`${label} mb-4`} style={fadeUp(inView)}>Full-Stack · Web-App · 2026</p>
                    <h1 className="m-0 max-w-[16ch] text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
                        <RevealLine inView={inView} delay={60}>Ein Kochbuch,</RevealLine>
                        <RevealLine inView={inView} delay={160}><span className="italic text-accent-deep">das wirklich genutzt wird.</span></RevealLine>
                    </h1>
                    <p className="m-0 mt-8 max-w-[58ch] font-inter text-base leading-relaxed text-stone-600 sm:text-lg" style={fadeUp(inView, 0.3)}>
                        Eine Web-App für den privaten Gebrauch: Rezepte mit Fotos, Bewertungen pro Person und Benachrichtigungen,
                        wenn etwas Neues eingetragen wird. Kein Demo-Projekt, sondern ein Werkzeug für den Alltag, das mit jedem
                        Feedback weiterwächst.
                    </p>

                    <dl className="m-0 mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4" style={fadeUp(inView, 0.4)}>
                        {FACTS.map((f) => (
                            <div key={f.label} className="bg-cream p-5">
                                <dt className="text-3xl font-medium tracking-tight">{f.value}</dt>
                                <dd className="m-0 mt-1 font-inter text-xs leading-snug text-stone-500">{f.label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* phone gallery: swipeable row on mobile, grid from lg up */}
                <div className="-mx-5 overflow-x-auto px-5 pb-6 sm:-mx-12 sm:px-12 lg:mx-0 lg:overflow-visible lg:px-0">
                    <ul className="m-0 flex w-max list-none gap-5 p-0 lg:grid lg:w-auto lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                        {SCREENS.map((s) => (
                            <li key={s.src} className="w-[240px] shrink-0 sm:w-[260px] lg:w-auto">
                                <figure className="m-0">
                                    <img
                                        src={s.src}
                                        alt={s.caption}
                                        loading="lazy"
                                        width={786}
                                        height={1704}
                                        className="block h-auto w-full rounded-[28px] shadow-[0_30px_60px_-20px_rgba(60,40,20,0.35)] ring-[6px] ring-ink"
                                    />
                                    <figcaption className="mt-4 font-inter text-sm leading-snug text-stone-600">{s.caption}</figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="m-0 mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                    Screenshots mit Demo-Daten · die echte App liegt hinter einem Login
                </p>

                <div className="mt-16">
                    <Section kicker="Funktionen" title="Was die App kann">
                        <ul className="m-0 flex list-none flex-col p-0">
                            {FEATURES.map(([title, text]) => (
                                <li key={title} className="border-t border-ink/10 py-5 first:border-t-0 first:pt-0">
                                    <h3 className="m-0 mb-1.5 text-xl font-medium tracking-tight">{title}</h3>
                                    <p className="m-0 font-inter text-sm leading-relaxed text-stone-600">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section kicker="Technik" title="Unter der Haube">
                        <ul className="m-0 mb-10 flex list-none flex-wrap gap-2 p-0">
                            {STACK.map((s) => (
                                <li key={s} className="rounded-full border border-ink/15 px-3.5 py-1.5 font-inter text-sm text-stone-700">{s}</li>
                            ))}
                        </ul>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {DECISIONS.map(([title, text]) => (
                                <div key={title}>
                                    <h3 className="m-0 mb-1.5 text-xl font-medium tracking-tight">{title}</h3>
                                    <p className="m-0 font-inter text-sm leading-relaxed text-stone-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section kicker="Vorgehen" title="Gebaut nach Feedback">
                        <p className="m-0 mb-6 max-w-[60ch] font-inter text-base leading-relaxed text-stone-600">
                            Die erste Version stand an einem Tag. Danach kam jede Änderung aus dem echten Gebrauch: Was im Alltag hakt,
                            wird zeitnah umgesetzt und deployt. Ein paar Beispiele aus dem Verlauf:
                        </p>
                        <ul className="m-0 flex list-none flex-col gap-3 p-0">
                            {[
                                'Zubereitung als freies Textfeld statt starrer Einzelschritte, weil Rezepte aus dem Netz selten sauber gegliedert sind',
                                'Server nach Frankfurt verlegt und Lade-Skelette ergänzt, nachdem die App auf dem iPhone träge wirkte',
                                'Kein Auto-Zoom mehr beim Tippen in Formulare auf dem iPhone',
                                'Rezepte wahlweise als Raster oder Liste, Trefferzahl direkt neben den Filtern',
                            ].map((item) => (
                                <li key={item} className="flex gap-3 font-inter text-sm leading-relaxed text-stone-700">
                                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>
            </main>
        </div>
    );
}

export default Kochbuch;
