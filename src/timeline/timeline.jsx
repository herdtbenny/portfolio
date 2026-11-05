import { FiDownload, FiExternalLink } from 'react-icons/fi';
import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

// Mirrors public/Lebenslauf_Benny_Herdt.pdf, keep both in sync. Newest first per group.
const CV_PDF = '/Lebenslauf_Benny_Herdt.pdf';
const CV_PREVIEW = '/lebenslauf-preview.jpg';

const GROUPS = [
    {
        label: 'Praxiserfahrung',
        stations: [
            {
                period: 'seit 09/2025',
                place: 'Köln / Remote',
                org: 'IMPECT GmbH',
                orgNote: 'A Catapult Sports Company',
                current: true,
                roles: [
                    {
                        title: 'IT-Werkstudent',
                        meta: 'seit 02/2026 · remote, ca. 20 Std./Woche',
                        points: [
                            'Feature-Entwicklung für die Analyse-Plattformen – Java im Backend, Angular im Frontend',
                            'Verarbeitung und Darstellung von Eventdaten für Vereine und Analysten',
                            'Abstimmung von Anforderungen zwischen Fachseite und Entwicklungsteam',
                        ],
                    },
                    {
                        title: 'IT-Praktikant (Praxissemester)',
                        meta: '09/2025 – 01/2026 · Köln, vor Ort',
                        points: [
                            'Aufbau und Pflege automatisierter End-to-End-Tests mit Cypress für die Plattformen',
                            'Ersatz manueller Regressionstests und damit schnellere Release-Zyklen',
                        ],
                    },
                ],
            },
            {
                period: '04/2022 – 06/2025',
                place: 'Regensburg',
                org: 'SSV Jahn Regensburg',
                roles: [
                    {
                        title: 'Werkstudent',
                        meta: '10/2023 – 06/2025 · Teilzeit',
                        points: [
                            'Beratung und Verkauf im Fanshop (auch an Spieltagen), Ticketing und Merchandising',
                            'Inhaltspflege und Nutzerbetreuung im Learning-Management-System des Vereins',
                        ],
                    },
                    {
                        title: 'Fußballtrainer',
                        meta: '04/2022 – 06/2025 · Teilzeit',
                        points: ['Planung und Leitung von Feriencamps und Fördertrainings für Kinder und Jugendliche'],
                    },
                ],
            },
            {
                period: '08/2023 – 10/2023',
                place: 'Regensburg',
                org: 'Infineon Technologies AG',
                roles: [
                    {
                        title: 'Werkstudent',
                        meta: 'Vollzeit · Halbleiterfertigung',
                        points: ['Anlagenbedienung im Vollkonti-Schichtbetrieb, Qualitätsmessungen an Mikrochips, Lostransport'],
                    },
                ],
            },
            {
                period: '05/2022 – 12/2024',
                place: 'Regensburg',
                org: 'Regensburg Events',
                roles: [
                    {
                        title: 'Werkstudent',
                        meta: 'Teilzeit',
                        points: ['Veranstaltungsbetreuung: Auf- und Abbau, Kasse, Gästebetreuung und Organisation'],
                    },
                ],
            },
        ],
    },
    {
        label: 'Ausbildung',
        stations: [
            {
                period: '10/2023 – vsl. 10/2027',
                place: 'Regensburg',
                org: 'Bachelor of Science Wirtschaftsinformatik',
                orgNote: 'OTH Regensburg',
                current: true,
                roles: [
                    {
                        points: [
                            'Aktueller Notendurchschnitt: 1,8',
                            'Schwerpunkte: Verteilte Systeme, Microservices, Datenbankdesign, Algorithmen',
                        ],
                    },
                ],
            },
            {
                period: '09/2015 – 07/2023',
                place: 'Regensburg',
                org: 'Allgemeine Hochschulreife',
                orgNote: 'Werner-von-Siemens-Gymnasium',
                roles: [{ points: ['Notendurchschnitt 2,0 · wirtschaftswissenschaftlicher Zweig'] }],
            },
        ],
    },
];

const LANGUAGES = ['Deutsch (Muttersprache)', 'Englisch (C1)', 'Spanisch (B1)', 'Kleines Latinum'];

function Dot({ current }) {
    return (
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            {current && <span className="absolute inset-0 animate-ping rounded-full bg-accent-deep/40 motion-reduce:animate-none" />}
            <span
                className={`relative h-3.5 w-3.5 rounded-full border-2 ${
                    current ? 'border-accent-deep bg-accent-deep' : 'border-ink/30 bg-cream'
                }`}
            />
        </span>
    );
}

function Station({ station, inView, delay }) {
    return (
        <li className="relative grid grid-cols-[14px_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[14px_170px_1fr] sm:gap-x-8" style={fadeUp(inView, delay)}>
            <div className="pt-2.5">
                <Dot current={station.current} />
            </div>

            <div className="col-start-2 mb-3 sm:mb-0 sm:pt-1.5">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-700">{station.period}</p>
                <p className="m-0 mt-1 font-inter text-xs text-stone-500">{station.place}</p>
            </div>

            <div className="col-start-2 sm:col-start-3">
                <h4 className="m-0 text-2xl font-medium leading-tight tracking-tight text-ink sm:text-3xl">
                    {station.org}
                    {station.orgNote && (
                        <span className="ml-3 align-middle font-inter text-sm font-normal tracking-normal text-stone-500">{station.orgNote}</span>
                    )}
                </h4>
                <div className="mt-4 flex flex-col gap-5">
                    {station.roles.map((role, i) => (
                        <div key={role.title ?? i}>
                            {role.title && (
                                <p className="m-0 mb-2 font-inter text-sm">
                                    <span className="font-semibold text-accent-deep">{role.title}</span>
                                    {role.meta && <span className="ml-2 text-stone-500">{role.meta}</span>}
                                </p>
                            )}
                            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                                {role.points.map((point) => (
                                    <li key={point} className="flex gap-3 font-inter text-[15px] leading-relaxed text-stone-700">
                                        <span className="mt-[11px] h-px w-3 shrink-0 bg-accent-deep" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </li>
    );
}

function CvCard({ inView }) {
    return (
        <aside className="lg:sticky lg:top-28" style={fadeUp(inView, 0.2)}>
            <p className="m-0 mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Lebenslauf als PDF</p>
            <a
                href={CV_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-25px_rgba(29,27,24,0.35)] ring-1 ring-ink/10 transition-transform duration-500 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                aria-label="Lebenslauf im Browser öffnen"
            >
                <img
                    src={CV_PREVIEW}
                    alt="Vorschau des Lebenslaufs von Benny Herdt"
                    loading="lazy"
                    width={1274}
                    height={1800}
                    className="block h-auto w-full"
                />
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
                <a
                    href={CV_PDF}
                    download="Lebenslauf_Benny_Herdt.pdf"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 font-inter text-sm font-semibold text-cream no-underline transition-[background,transform] duration-200 ease-out hover:bg-accent-deep active:scale-[0.97]"
                >
                    <FiDownload className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    PDF herunterladen
                </a>
                <a
                    href={CV_PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-5 py-3 font-inter text-sm font-semibold text-ink no-underline transition-colors duration-200 hover:border-ink/50"
                >
                    <FiExternalLink />
                    Im Browser öffnen
                </a>
            </div>
        </aside>
    );
}

function Timeline() {
    const [ref, inView] = useInView();

    return (
        <section
            id="lebenslauf"
            className="relative box-border overflow-hidden bg-cream px-5 pb-20 pt-28 font-serif sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent-deep">
                            <RevealLine inView={inView} delay={0}>Stationen</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-medium leading-none tracking-tight text-ink sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Lebenslauf</RevealLine>
                        </h2>
                    </div>
                    <a
                        href={CV_PDF}
                        download="Lebenslauf_Benny_Herdt.pdf"
                        className="group inline-flex items-center gap-2.5 border-b border-ink/25 pb-1.5 font-inter text-sm font-semibold text-ink no-underline transition-colors duration-200 hover:border-accent-deep hover:text-accent-deep"
                        style={fadeUp(inView, 0.25)}
                    >
                        <FiDownload className="transition-transform duration-200 group-hover:translate-y-0.5" />
                        Lebenslauf herunterladen (PDF)
                    </a>
                </header>

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-14">
                    <div className="flex flex-col gap-16 lg:col-span-8">
                        {GROUPS.map((group, g) => (
                            <div key={group.label}>
                                <h3
                                    className="m-0 mb-10 border-b border-ink/10 pb-4 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-stone-500"
                                    style={fadeUp(inView, 0.15 + g * 0.1)}
                                >
                                    {group.label}
                                </h3>
                                <div className="relative">
                                    {/* the line draws itself top to bottom behind the dots */}
                                    <div className="absolute bottom-2 left-[6px] top-3 w-px">
                                        <div
                                            className="h-full w-full origin-top bg-gradient-to-b from-ink/25 via-ink/15 to-transparent"
                                            style={{
                                                transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                                                transition: `transform 1.4s ${EASE} 0.2s`,
                                            }}
                                        />
                                    </div>
                                    <ol className="m-0 list-none p-0">
                                        {group.stations.map((station, i) => (
                                            <Station key={station.org} station={station} inView={inView} delay={0.25 + g * 0.1 + i * 0.08} />
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        ))}

                        <div style={fadeUp(inView, 0.5)}>
                            <h3 className="m-0 mb-6 border-b border-ink/10 pb-4 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-stone-500">
                                Sprachen
                            </h3>
                            <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
                                {LANGUAGES.map((lang) => (
                                    <li key={lang} className="text-xl tracking-tight text-ink">{lang}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <CvCard inView={inView} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Timeline;
