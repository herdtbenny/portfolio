import { FiArrowDown } from 'react-icons/fi';
import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import { ROLE_TRACKS } from './roleTracks';
import { PROJECTS } from '../projects/projectData';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

function Focus() {
    const [ref, inView] = useInView();

    return (
        <section
            id="profil"
            className="relative box-border overflow-hidden bg-cream px-5 pb-20 pt-28 font-serif sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent-deep">
                            <RevealLine inView={inView} delay={0}>Profil</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-medium leading-none tracking-tight text-ink sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Wo ich Wirkung habe</RevealLine>
                        </h2>
                    </div>
                    <p className="m-0 max-w-xs font-inter text-sm leading-relaxed text-stone-500" style={fadeUp(inView, 0.25)}>
                        Drei Profile, jeweils mit Belegen aus Job und Projekten.
                    </p>
                </header>

                {/* one profile per row: big number + title left, pitch and proof right */}
                <ol className="m-0 list-none border-b border-ink/10 p-0">
                    {ROLE_TRACKS.map((track, i) => {
                        const count = PROJECTS.filter((p) => p.roles.includes(track.id)).length;
                        return (
                            <li
                                key={track.id}
                                className="grid grid-cols-1 gap-6 border-t border-ink/10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12"
                                style={fadeUp(inView, 0.1 + i * 0.1)}
                            >
                                <div className="lg:col-span-5">
                                    <p className="m-0 mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
                                        {track.short}
                                    </p>
                                    <div className="flex items-baseline gap-5">
                                        <span className="text-5xl font-medium leading-none tracking-tight text-accent-deep sm:text-6xl">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="m-0 text-2xl font-medium leading-tight tracking-tight text-ink sm:text-3xl">
                                            {track.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:col-span-7">
                                    <p className="m-0 mb-6 max-w-[60ch] font-inter text-base leading-relaxed text-stone-600">{track.pitch}</p>
                                    <ul className="m-0 mb-8 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                                        {track.proof.map((item) => (
                                            <li key={item} className="flex gap-3 font-inter text-sm leading-snug text-stone-700">
                                                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="group inline-flex items-center gap-3 self-start border-0 border-b border-solid border-ink/25 bg-transparent px-0 pb-1.5 font-inter text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent-deep hover:text-accent-deep"
                                    >
                                        {count} passende Projekte
                                        <FiArrowDown className="text-xs transition-transform duration-200 group-hover:translate-y-0.5" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

export default Focus;
