import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck } from 'react-icons/fi';
import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import Footer from '../footer/footer';
import { PROJECTS } from '../projects/projectData';
import { ROLE_TRACKS } from '../focus/roleTracks';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

const sectionLabel = 'm-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent';
const sectionTitle = 'm-0 text-3xl font-extrabold leading-none tracking-tight text-white sm:text-5xl';
const monoLabel = 'm-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500';

const FACTS = [
    { value: 'B.Sc.', label: 'Wirtschaftsinformatik', detail: 'OTH Regensburg · vsl. 09/2027' },
    { value: 'IMPECT', label: 'Werkstudent', detail: 'Software für Fußballdatenanalyse' },
    { value: 'Gründer', label: 'Webs by Benny', detail: 'Webagentur für lokale Betriebe' },
    { value: String(PROJECTS.length), label: 'Projekte', detail: `davon ${PROJECTS.filter((p) => p.href.startsWith('/')).length} interaktiv im Browser` },
];

// which project demonstrates which competency; `site` is this portfolio itself
const COMPETENCIES = [
    { group: 'Engineering', name: 'Komponenten-Architektur in React', ids: ['websbybenny', 'xglab', 'sportscorings', 'finanztracker', 'rbac', 'site'] },
    { group: 'Engineering', name: 'REST-APIs & Datenintegration', ids: ['sportscorings', 'rbac'] },
    { group: 'Engineering', name: 'Authentifizierung & Security', ids: ['rbac'] },
    { group: 'Engineering', name: 'Performance & Barrierefreiheit', ids: ['site'] },
    { group: 'Data', name: 'Statistische Modellierung', ids: ['xglab'] },
    { group: 'Data', name: 'Datenvisualisierung', ids: ['xglab', 'sportscorings', 'finanztracker'] },
    { group: 'Data', name: 'Datenbereinigung & -filterung', ids: ['sportscorings'] },
    { group: 'Business', name: 'KPI- & Controlling-Logik', ids: ['finanztracker'] },
    { group: 'Business', name: 'Anforderungen & Kundenkommunikation', ids: ['websbybenny'] },
    { group: 'Business', name: 'Deployment & Betrieb', ids: ['websbybenny', 'site'] },
];

const MATRIX_COLUMNS = [
    ...PROJECTS.map((p) => ({ id: p.id, title: p.title, accent: p.accent })),
    { id: 'site', title: 'Dieses Portfolio', accent: '#8fb0ff' },
];

const UNDER_THE_HOOD = [
    {
        title: 'Nahtloser Video-Loop',
        text: 'Zwei Video-Elemente blenden kurz vor dem Loop-Punkt ineinander über. Die zweite Kopie lädt erst, wenn die erste vollständig gepuffert ist – so kommt sie aus dem Cache statt doppelt aus dem Netz.',
    },
    {
        title: 'Respektiert Nutzereinstellungen',
        text: 'Bei „Bewegung reduzieren“ oder aktivem Datensparmodus wird nur ein Standbild geladen. Das spart rund 3 MB und vermeidet Animationen, die manchen Menschen Probleme bereiten.',
    },
    {
        title: 'Flüssiges Scrollen',
        text: 'Scroll-Effekte laufen über passive Listener und werden per requestAnimationFrame auf einen Frame gedrosselt. Einblend-Animationen nutzen den IntersectionObserver statt pro Element zu messen.',
    },
    {
        title: 'Eine Datenquelle',
        text: 'Projekte, Profile und Case Studies stehen in einer Datei. Startseite, Projektkarten und diese Aufschlüsselung lesen daraus – ein neues Projekt taucht automatisch überall auf, inklusive Kompetenzmatrix.',
    },
    {
        title: 'Automatisierte Screenshots',
        text: 'Ein Playwright-Skript fotografiert die Live-Projekte im passenden 16:10-Format. Die Vorschaubilder bleiben aktuell, ohne dass ich manuell Screenshots zuschneide.',
    },
    {
        title: 'Formular mit Fallback',
        text: 'Das Kontaktformular sendet per fetch mit Status-Feedback, hat aber eine echte action – ohne JavaScript funktioniert es trotzdem.',
    },
];

// owns its observer: whole sections can be taller than the 20 % threshold allows
function SectionHeader({ label, title, aside }) {
    const [ref, inView] = useInView();
    return (
        <header ref={ref} className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
            <div>
                <p className={sectionLabel}><RevealLine inView={inView} delay={0}>{label}</RevealLine></p>
                <h2 className={sectionTitle}><RevealLine inView={inView} delay={120}>{title}</RevealLine></h2>
            </div>
            {aside && (
                <p className="m-0 max-w-xs font-inter text-sm leading-relaxed text-neutral-500" style={fadeUp(inView, 0.25)}>{aside}</p>
            )}
        </header>
    );
}

function ProjectLink({ href, className, children }) {
    if (href.startsWith('/')) return <Link to={href} className={className}>{children}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

function CaseStudy({ project, index }) {
    const [ref, inView] = useInView();
    const { caseStudy } = project;

    return (
        <article id={project.id} ref={ref} className="scroll-mt-24 border-t border-white/10 pt-8" style={fadeUp(inView)}>
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                <span className="text-white">{String(index + 1).padStart(2, '0')}</span>
                <span className="h-px w-8 bg-white/20" />
                <span>{project.kind}</span>
                <span className="text-neutral-700">/</span>
                <span>{project.period}</span>
                <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                    <h3 className="m-0 mb-4 text-3xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-4xl">{project.title}</h3>
                    <ul className="m-0 mb-6 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        {project.skills.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                    <ProjectLink
                        href={project.href}
                        className="group inline-flex items-center gap-3 border-b border-white/25 pb-1.5 font-inter text-sm font-semibold text-white no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                        {project.linkLabel}
                        {project.href.startsWith('/') ? <FiArrowRight className="text-xs" /> : <FiArrowUpRight className="text-xs" />}
                    </ProjectLink>
                </div>

                <div className="grid grid-cols-1 gap-8 font-inter sm:grid-cols-2 lg:col-span-8">
                    <div>
                        <p className={`${monoLabel} mb-3`}>Problem</p>
                        <p className="m-0 text-sm leading-relaxed text-neutral-300">{caseStudy.problem}</p>
                    </div>
                    <div>
                        <p className={`${monoLabel} mb-3`}>Ansatz</p>
                        <p className="m-0 text-sm leading-relaxed text-neutral-300">{caseStudy.approach}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className={`${monoLabel} mb-3`}>Was es zeigt</p>
                        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-2.5 p-0 sm:grid-cols-2">
                            {caseStudy.highlights.map((h) => (
                                <li key={h} className="flex gap-3 text-sm leading-snug text-neutral-300">
                                    <FiCheck className="mt-0.5 shrink-0" style={{ color: project.accent }} />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="sm:col-span-2">
                        <p className={`${monoLabel} mb-3`}>Nächste Ausbaustufe</p>
                        <p className="m-0 text-sm leading-relaxed text-neutral-500">{caseStudy.next}</p>
                    </div>
                </div>
            </div>
        </article>
    );
}

function Breakdown() {
    const [params, setParams] = useSearchParams();
    const activeTrack = ROLE_TRACKS.find((t) => t.id === params.get('profil')) ?? null;
    const projects = activeTrack ? PROJECTS.filter((p) => p.roles.includes(activeTrack.id)) : PROJECTS;

    const [heroRef, heroInView] = useInView();
    const [matrixRef, matrixInView] = useInView();
    const [hoodRef, hoodInView] = useInView();
    const [ctaRef, ctaInView] = useInView();

    const selectTrack = (id) => setParams(id ? { profil: id } : {}, { replace: true });

    return (
        <div className="min-h-screen bg-[#000000] font-syne text-white">
            <div className="pointer-events-none absolute -right-28 -top-36 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.10)_0%,transparent_70%)]" />

            <nav className="relative mx-auto flex max-w-[1200px] items-center justify-between px-5 pt-8 sm:px-12 lg:px-0">
                <Link to="/" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400 no-underline transition-colors hover:text-white">
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" /> Portfolio
                </Link>
                <a href="mailto:herdtbenny@gmail.com" className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400 no-underline transition-colors hover:text-accent">
                    herdtbenny@gmail.com
                </a>
            </nav>

            {/* INTRO */}
            <section ref={heroRef} className="relative px-5 pb-20 pt-20 sm:px-12 sm:pt-28 lg:px-20">
                <div className="mx-auto max-w-[1200px]">
                    <p className={sectionLabel}><RevealLine inView={heroInView} delay={0}>Für Recruiter & Teams</RevealLine></p>
                    <h1 className="m-0 max-w-[16ch] text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
                        <RevealLine inView={heroInView} delay={100}>Was in diesem</RevealLine>
                        <RevealLine inView={heroInView} delay={200}><span className="text-white/65">Portfolio steckt</span></RevealLine>
                    </h1>
                    <p className="m-0 mt-8 max-w-[60ch] font-inter text-base leading-relaxed text-neutral-400" style={fadeUp(heroInView, 0.35)}>
                        Jedes Projekt hier ist bewusst gewählt, um eine bestimmte Fähigkeit zu belegen. Auf dieser Seite steht, welche – mit Problem,
                        Lösungsansatz und den technischen Entscheidungen dahinter. Wähle ein Profil, um nur die relevanten Projekte zu sehen.
                    </p>

                    <dl className="m-0 mt-14 grid grid-cols-2 border-t border-white/10 lg:grid-cols-4" style={fadeUp(heroInView, 0.45)}>
                        {FACTS.map((f, i) => (
                            <div key={f.label} className={`border-b border-white/10 py-6 pr-4 lg:border-b-0 ${i % 2 === 1 ? 'pl-4 lg:pl-6' : ''} ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-6' : ''}`}>
                                <dt className={monoLabel}>{f.label}</dt>
                                <dd className="m-0 mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{f.value}</dd>
                                <dd className="m-0 mt-1 font-inter text-xs text-neutral-500">{f.detail}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* CASE STUDIES */}
            <section className="relative px-5 pb-20 pt-12 sm:px-12 sm:pb-28 lg:px-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionHeader label="Case Studies" title="Projekt für Projekt" />

                    <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Nach Profil filtern">
                        {[{ id: null, short: 'Alle Projekte' }, ...ROLE_TRACKS].map((t) => {
                            const active = (activeTrack?.id ?? null) === t.id;
                            return (
                                <button
                                    key={t.short}
                                    type="button"
                                    onClick={() => selectTrack(t.id)}
                                    aria-pressed={active}
                                    className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                                        active ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
                                    }`}
                                >
                                    {t.short}
                                </button>
                            );
                        })}
                    </div>

                    {activeTrack && (
                        <div key={activeTrack.id} className="mb-12 animate-slideUp rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 font-inter sm:p-8">
                            <p className={`${monoLabel} mb-3`}>{activeTrack.title}</p>
                            <p className="m-0 mb-5 max-w-[70ch] text-base leading-relaxed text-neutral-200">{activeTrack.pitch}</p>
                            <ul className="m-0 flex list-none flex-col gap-2 p-0 sm:flex-row sm:flex-wrap sm:gap-x-8">
                                {activeTrack.proof.map((p) => (
                                    <li key={p} className="flex gap-2.5 text-sm text-neutral-400">
                                        <FiCheck className="mt-0.5 shrink-0 text-accent" />{p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex flex-col gap-16">
                        {projects.map((p) => (
                            <CaseStudy key={p.id} project={p} index={PROJECTS.indexOf(p)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* COMPETENCY MATRIX */}
            <section ref={matrixRef} className="relative px-5 pb-20 pt-12 sm:px-12 sm:pb-28 lg:px-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionHeader
                        label="Überblick"
                        title="Kompetenzmatrix"
                        aside="Welche Fähigkeit wird wo belegt? Jeder Punkt verweist auf echten, ansehbaren Code."
                    />
                    <div className="overflow-x-auto" style={fadeUp(matrixInView, 0.2)}>
                        <table className="w-full min-w-[760px] border-collapse font-inter text-sm">
                            <thead>
                                <tr>
                                    <th className="border-b border-white/10 py-3 pr-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-600">Kompetenz</th>
                                    {MATRIX_COLUMNS.map((c) => (
                                        <th key={c.id} className="border-b border-white/10 px-2 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                                            {c.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {COMPETENCIES.map((row, i) => (
                                    <tr key={row.name} className="group">
                                        <td className="border-b border-white/[0.06] py-3 pr-4 text-neutral-300 group-hover:text-white">
                                            {(i === 0 || COMPETENCIES[i - 1].group !== row.group) && (
                                                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-accent/80">{row.group}</span>
                                            )}
                                            {row.name}
                                        </td>
                                        {MATRIX_COLUMNS.map((c) => (
                                            <td key={c.id} className="border-b border-white/[0.06] px-2 py-3 text-center">
                                                {row.ids.includes(c.id) ? (
                                                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.accent }} title={`${row.name} · ${c.title}`} />
                                                ) : (
                                                    <span className="inline-block h-1 w-1 rounded-full bg-white/10" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* UNDER THE HOOD */}
            <section ref={hoodRef} className="relative px-5 pb-20 pt-12 sm:px-12 sm:pb-28 lg:px-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionHeader
                        label="Unter der Haube"
                        title="Diese Seite selbst"
                        aside="Auch das Portfolio ist ein Projekt. React 19, React Router, Tailwind, Deployment auf Vercel."
                    />
                    <ol className="m-0 grid list-none grid-cols-1 gap-x-12 p-0 md:grid-cols-2">
                        {UNDER_THE_HOOD.map((item, i) => (
                            <li key={item.title} className="border-t border-white/10 py-7" style={fadeUp(hoodInView, 0.1 + i * 0.06)}>
                                <p className={`${monoLabel} mb-3`}>
                                    <span className="mr-3 text-neutral-700">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-white">{item.title}</span>
                                </p>
                                <p className="m-0 font-inter text-sm leading-relaxed text-neutral-400">{item.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* CTA */}
            <section ref={ctaRef} className="relative px-5 pb-24 pt-12 sm:px-12 sm:pb-32 lg:px-20">
                <div className="mx-auto max-w-[1200px] border-t border-white/10 pt-16 text-center" style={fadeUp(ctaInView)}>
                    <p className={sectionLabel}>Nächster Schritt</p>
                    <h2 className="m-0 mx-auto max-w-[18ch] text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                        Lass uns sprechen.
                    </h2>
                    <p className="m-0 mx-auto mt-5 max-w-[48ch] font-inter text-sm leading-relaxed text-neutral-400">
                        Ich freue mich über Anfragen zu Werkstudenten-Stellen, Praktika, Abschlussarbeiten und Projekten.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="mailto:herdtbenny@gmail.com"
                            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-inter text-sm font-semibold text-black no-underline transition-[background,transform] duration-200 ease-out hover:bg-accent active:scale-[0.97]"
                        >
                            E-Mail schreiben
                            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                        <a
                            href="https://linkedin.com/in/benny-herdt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-inter text-sm font-semibold text-white no-underline transition-colors hover:border-white/40"
                        >
                            LinkedIn <FiArrowUpRight />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Breakdown;
