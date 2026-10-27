import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
            className="relative box-border overflow-hidden bg-[#000000] px-5 pb-20 pt-28 font-syne sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent">
                            <RevealLine inView={inView} delay={0}>Profil</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Wo ich Wirkung habe</RevealLine>
                        </h2>
                    </div>
                    <p className="m-0 max-w-xs font-inter text-sm leading-relaxed text-neutral-500" style={fadeUp(inView, 0.25)}>
                        Drei Profile, jeweils mit Belegen aus Job und Projekten. Die Aufschlüsselung zeigt, was wofür relevant ist.
                    </p>
                </header>

                <ol className="m-0 grid list-none grid-cols-1 border-b border-white/10 p-0 lg:grid-cols-3 lg:border-b-0">
                    {ROLE_TRACKS.map((track, i) => {
                        const count = PROJECTS.filter((p) => p.roles.includes(track.id)).length;
                        return (
                            <li
                                key={track.id}
                                className="flex flex-col border-t border-white/10 py-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-2 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                                style={fadeUp(inView, 0.1 + i * 0.1)}
                            >
                                <p className="m-0 mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                                    <span className="text-white">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="mx-3 inline-block h-px w-6 bg-white/20 align-middle" />
                                    {track.short}
                                </p>
                                <h3 className="m-0 mb-4 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                                    {track.title}
                                </h3>
                                <p className="m-0 mb-6 font-inter text-sm leading-relaxed text-neutral-400">{track.pitch}</p>
                                <ul className="m-0 mb-8 flex list-none flex-col gap-2.5 p-0">
                                    {track.proof.map((item) => (
                                        <li key={item} className="flex gap-3 font-inter text-[13px] leading-snug text-neutral-300">
                                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to={`/aufschluesselung?profil=${track.id}`}
                                    className="group mt-auto inline-flex items-center gap-3 self-start border-b border-white/25 pb-1.5 font-inter text-sm font-semibold text-white no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
                                >
                                    {count} passende Projekte
                                    <FiArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

export default Focus;
