import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import { PROJECTS } from './projectData';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

/* internal routes stay in the SPA, external links open in a new tab */
function ProjectLink({ href, className, children, ...rest }) {
    if (href.startsWith('/')) {
        return <Link to={href} className={className} {...rest}>{children}</Link>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>{children}</a>;
}

/* frameless screenshot: no browser chrome, just the page with a thin ring and a colored glow from the project's accent */
function Shot({ project, inView }) {
    const img = (
        <div className="relative">
            <div
                className="pointer-events-none absolute -inset-6 -z-10 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: `radial-gradient(60% 60% at 50% 50%, ${project.accent}55, transparent 70%)` }}
            />
            <div className="overflow-hidden rounded-[6px] ring-1 ring-white/10">
                <img
                    src={project.image}
                    alt={`Screenshot ${project.title}`}
                    loading="lazy"
                    width={2160}
                    height={1350}
                    className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            </div>
        </div>
    );

    return (
        <div style={fadeUp(inView, 0.15)}>
            {project.href ? (
                <ProjectLink href={project.href} className="group block" aria-label={`${project.title} öffnen`} tabIndex={-1}>
                    {img}
                </ProjectLink>
            ) : (
                <div className="group">{img}</div>
            )}
        </div>
    );
}

function ProjectSpread({ project, index }) {
    const [ref, inView] = useInView();
    const flipped = index % 2 === 1;
    const number = String(index + 1).padStart(2, '0');

    return (
        <article ref={ref} className="border-t border-white/10 pt-6 sm:pt-8">
            {/* meta row */}
            <div
                className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500 sm:mb-8"
                style={fadeUp(inView)}
            >
                <span className="text-white">{number}</span>
                <span className="h-px w-8 bg-white/20" />
                <span>{project.kind}</span>
                <span className="text-neutral-700">/</span>
                <span>{project.period}</span>
                <span className="ml-auto inline-flex items-center gap-2 text-neutral-400">
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'animate-pulse motion-reduce:animate-none' : ''}`}
                        style={{ backgroundColor: project.accent }}
                    />
                    {project.status}
                </span>
            </div>

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-6 ${flipped ? 'lg:order-2' : ''}`}>
                    <h3 className="m-0 mb-4 text-3xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-4xl">
                        <RevealLine inView={inView} delay={60}>{project.title}</RevealLine>
                    </h3>

                    <div style={fadeUp(inView, 0.1)}>
                        <p className="m-0 mb-6 max-w-[46ch] font-inter text-sm leading-relaxed text-neutral-400">
                            {project.summary}
                        </p>

                        {project.href && (
                            <ProjectLink
                                href={project.href}
                                className="group/link inline-flex items-center gap-3 border-b border-white/25 pb-1.5 font-inter text-sm font-semibold text-white no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
                            >
                                {project.linkLabel}
                                {project.href.startsWith('/') ? (
                                    <FiArrowRight className="text-xs transition-transform duration-200 group-hover/link:translate-x-1" />
                                ) : (
                                    <FiArrowUpRight className="text-xs transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                )}
                            </ProjectLink>
                        )}
                    </div>
                </div>

                <div className={`lg:col-span-6 ${flipped ? 'lg:order-1' : ''}`}>
                    <Shot project={project} inView={inView} />
                </div>
            </div>
        </article>
    );
}

function Projects() {
    const [ref, inView] = useInView();

    return (
        <section
            id="projects"
            className="relative box-border overflow-hidden bg-[#000000] px-5 pb-20 pt-28 font-syne sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div className="pointer-events-none absolute -right-28 -top-36 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.08)_0%,transparent_70%)] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />

            <div className="relative mx-auto w-full max-w-[1200px]">
                <header ref={ref} className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent">
                            <RevealLine inView={inView} delay={0}>Portfolio</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Projekte</RevealLine>
                        </h2>
                    </div>
                    <p
                        className="m-0 max-w-xs font-inter text-sm leading-relaxed text-neutral-500"
                        style={fadeUp(inView, 0.25)}
                    >
                        Eine eigene Webagentur und ein Side Project rund um Fußballdaten.
                    </p>
                </header>

                <div className="flex flex-col gap-14 sm:gap-20">
                    {PROJECTS.map((project, i) => (
                        <ProjectSpread key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
