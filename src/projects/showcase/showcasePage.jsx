import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import useInView from '../../hooks/useInView';
import RevealLine from '../../components/revealLine';

// Shared layout for the private apps (Kochbuch, Finanzboard, Foodie): hero with facts,
// a phone gallery of demo-data screenshots, then features, tech and how it was built.

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

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

/**
 * @param {object} p
 * @param {string} p.title          app name in the sticky header
 * @param {string} p.kicker         line above the headline
 * @param {[string, string]} p.headline  two lines, the second one is accented
 * @param {string} p.intro
 * @param {{value: string, label: string}[]} p.facts
 * @param {{src: string, caption: string}[]} p.screens
 * @param {[number, number]} p.screenSize  intrinsic width/height of the screenshots
 * @param {[string, string][]} p.features
 * @param {string[]} p.stack
 * @param {[string, string][]} p.decisions
 * @param {{title: string, intro: string, items: string[]}} p.process
 */
function ShowcasePage({ title, kicker, headline, intro, facts, screens, screenSize, features, stack, decisions, process }) {
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
                    <p className="m-0 truncate text-base font-semibold tracking-tight">{title}</p>
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-600">
                        <FiLock /> Privat
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-12">
                <div ref={ref} className="pb-14 pt-16 sm:pb-20 sm:pt-24">
                    <p className={`${label} mb-4`} style={fadeUp(inView)}>{kicker}</p>
                    <h1 className="m-0 max-w-[18ch] text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
                        <RevealLine inView={inView} delay={60}>{headline[0]}</RevealLine>
                        <RevealLine inView={inView} delay={160}><span className="text-accent-deep">{headline[1]}</span></RevealLine>
                    </h1>
                    <p className="m-0 mt-8 max-w-[58ch] font-inter text-base leading-relaxed text-stone-600 sm:text-lg" style={fadeUp(inView, 0.3)}>
                        {intro}
                    </p>

                    <dl className="m-0 mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4" style={fadeUp(inView, 0.4)}>
                        {facts.map((f) => (
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
                        {screens.map((s) => (
                            <li key={s.src} className="w-[240px] shrink-0 sm:w-[260px] lg:w-auto">
                                <figure className="m-0">
                                    <img
                                        src={s.src}
                                        alt={s.caption}
                                        loading="lazy"
                                        width={screenSize[0]}
                                        height={screenSize[1]}
                                        className="block h-auto w-full rounded-[28px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] ring-[6px] ring-neutral-800"
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
                            {features.map(([t, text]) => (
                                <li key={t} className="border-t border-ink/10 py-5 first:border-t-0 first:pt-0">
                                    <h3 className="m-0 mb-1.5 text-xl font-medium tracking-tight">{t}</h3>
                                    <p className="m-0 font-inter text-sm leading-relaxed text-stone-600">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section kicker="Technik" title="Unter der Haube">
                        <ul className="m-0 mb-10 flex list-none flex-wrap gap-2 p-0">
                            {stack.map((s) => (
                                <li key={s} className="rounded-full border border-ink/15 px-3.5 py-1.5 font-inter text-sm text-stone-700">{s}</li>
                            ))}
                        </ul>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {decisions.map(([t, text]) => (
                                <div key={t}>
                                    <h3 className="m-0 mb-1.5 text-xl font-medium tracking-tight">{t}</h3>
                                    <p className="m-0 font-inter text-sm leading-relaxed text-stone-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section kicker="Vorgehen" title={process.title}>
                        <p className="m-0 mb-6 max-w-[60ch] font-inter text-base leading-relaxed text-stone-600">{process.intro}</p>
                        <ul className="m-0 flex list-none flex-col gap-3 p-0">
                            {process.items.map((item) => (
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

export default ShowcasePage;
