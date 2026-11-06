import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import bennyImg from '../assets/benny.png';
import {
    SiAngular,
    SiTypescript,
    SiReact,
    SiCypress,
    SiHtml5,
    SiGitlab,
    SiPostgresql,
    SiTailwindcss,
    SiNextdotjs,
    SiSupabase,
    SiVercel, SiDocker, SiNodedotjs,
    SiCloudflare, SiFormspree, SiPostman, SiClaude, SiAnthropic, SiModelcontextprotocol,
    SiJavascript, SiC, SiOpenapiinitiative
} from 'react-icons/si';
import { FiBox, FiClipboard, FiGitMerge, FiLayout, FiList, FiTarget } from 'react-icons/fi';

import {FaJava} from 'react-icons/fa';
import OrgLinks from '../components/orgLinks';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

// icons stay neutral and take their brand color on hover
const skillGroups = [
    {
        label: 'Frontend',
        skills: [
            {name: 'React', Icon: SiReact, color: '#61dafb'},
            {name: 'Next.js', Icon: SiNextdotjs, color: '#1d1b18'},
            {name: 'Angular', Icon: SiAngular, color: '#dd0031'},
            {name: 'TypeScript', Icon: SiTypescript, color: '#3178c6'},
            {name: 'JavaScript', Icon: SiJavascript, color: '#e8c400'},
            {name: 'HTML/CSS', Icon: SiHtml5, color: '#e34f26'},
            {name: 'Tailwind', Icon: SiTailwindcss, color: '#38bdf8'},
        ],
    },
    {
        label: 'Backend',
        skills: [
            {name: 'Java', Icon: FaJava, color: '#f89820'},
            {name: 'Node.js', Icon: SiNodedotjs, color: '#3c873a'},
            {name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1'},
            {name: 'Supabase', Icon: SiSupabase, color: '#3ecf8e'},
            {name: 'REST-APIs', Icon: SiOpenapiinitiative, color: '#6ba539'},
            {name: 'Microservices', Icon: FiBox, color: '#1f3a5f'},
            {name: 'C', Icon: SiC, color: '#a8b9cc'},
        ],
    },
    {
        label: 'Product & Methoden',
        skills: [
            {name: 'Requirements Engineering', Icon: FiClipboard, color: '#1f3a5f'},
            {name: 'User Stories & Akzeptanzkriterien', Icon: FiList, color: '#1f3a5f'},
            {name: 'Backlog-Refinement', Icon: FiTarget, color: '#1f3a5f'},
            {name: 'Geschäftsprozessmodellierung', Icon: FiGitMerge, color: '#1f3a5f'},
            {name: 'Projektmanagement', Icon: FiClipboard, color: '#1f3a5f'},
            {name: 'UI/UX-Design', Icon: FiLayout, color: '#1f3a5f'},
        ],
    },
    {
        label: 'KI-Workflow',
        skills: [
            {name: 'Claude Code', Icon: SiClaude, color: '#d97757'},
            {name: 'Agent Skills', Icon: SiAnthropic, color: '#1d1b18'},
            {name: 'MCP', Icon: SiModelcontextprotocol, color: '#1d1b18'},
        ],
    },
    {
        label: 'Tools',
        skills: [
            {name: 'Git', Icon: SiGitlab, color: '#fc6d26'},
            {name: 'Docker', Icon: SiDocker, color: '#2496ed'},
            {name: 'Vercel', Icon: SiVercel, color: '#1d1b18'},
            {name: 'Cloudflare', Icon: SiCloudflare, color: '#f38020'},
            {name: 'Formspree', Icon: SiFormspree, color: '#90fe66'},
            {name: 'Cypress', Icon: SiCypress, color: '#1d1b18'},
            {name: 'Postman', Icon: SiPostman, color: '#ff6c37'},
        ],
    },
];

const sectionLabel = 'm-0 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500';

function About() {
    const [ref, inView] = useInView();

    return (
        <section
            id="about"
            className="relative box-border overflow-clip bg-cream px-5 pb-20 pt-6 font-serif sm:px-12 sm:pb-28 sm:pt-8 lg:px-20 lg:pt-10"
        >
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.08)_0%,transparent_70%)] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]" />

            <div ref={ref} className="relative mx-auto w-full max-w-[1280px]">
                <header className="mb-14 sm:mb-20">
                    <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent-deep">
                        <RevealLine inView={inView} delay={0}>Wer bin ich</RevealLine>
                    </p>
                    <h2 className="m-0 text-3xl font-medium leading-none tracking-tight text-ink sm:text-5xl">
                        <RevealLine inView={inView} delay={120}>Über mich</RevealLine>
                    </h2>
                    <p className="m-0 mt-5 font-inter text-sm leading-relaxed text-stone-600 sm:mt-6 sm:text-base" style={fadeUp(inView, 0.25)}>
                        <OrgLinks>Wirtschaftsinformatikstudent an der OTH Regensburg und Werkstudent in Softwareentwicklung und Product bei IMPECT.</OrgLinks>{' '}
                        Nebenbei Websiteentwicklung für lokale Unternehmen in der Region.{' '}
                        Meine Stärke liegt an der Schnittstelle zwischen Fachseite und Technik, von der Produktkonzeption bis zur Umsetzung mit zielgerichtetem Agentic Coding.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">

                    {/* PHOTO: frameless, fades into the page */}
                    {/* photo sits right and stays pinned while the tech stack scrolls past on the left */}
                    <figure className="relative m-0 lg:sticky lg:top-28 lg:order-2 lg:col-span-5" style={fadeUp(inView, 0.1)}>
                        <div className="pointer-events-none absolute inset-x-[5%] bottom-0 top-[15%] -z-0 rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.18)_0%,transparent_70%)] blur-3xl" />
                        <img
                            src={bennyImg}
                            alt="Benny Herdt"
                            className="relative mx-auto block aspect-[4/5] w-full max-w-[420px] object-cover object-top [filter:contrast(1.02)_brightness(1.02)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
                        />
                        <figcaption className="relative flex items-center justify-between border-t border-ink/10 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
                            <span className="text-ink">Benny Herdt</span>
                            <span>Regensburg</span>
                        </figcaption>
                    </figure>

                    {/* TECH STACK: one category per row, heading left, tools in a column grid right */}
                    <div className="lg:order-1 lg:col-span-7 lg:pt-4">
                        <div className="mb-6 flex items-baseline justify-between" style={fadeUp(inView)}>
                            <p className={sectionLabel}>Tech Stack</p>
                            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
                                {skillGroups.reduce((n, g) => n + g.skills.length, 0)} Tools
                            </p>
                        </div>
                        <div className="border-b border-ink/10">
                            {skillGroups.map((group, i) => (
                                <div
                                    key={group.label}
                                    className="grid grid-cols-1 items-baseline gap-4 border-t border-ink/10 py-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:py-8"
                                    style={fadeUp(inView, 0.08 + i * 0.08)}
                                >
                                    {/* category as a serif heading, tools stay lighter sans, so the two levels read apart */}
                                    <h3 className="m-0 font-serif text-xl font-medium leading-tight tracking-tight text-ink sm:text-2xl">
                                        {group.label}
                                    </h3>
                                    <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0">
                                        {group.skills.map(({name, Icon, color}) => (
                                            <li
                                                key={name}
                                                className="group flex min-w-0 items-center gap-3"
                                                style={{'--brand': color}}
                                            >
                                                <Icon className="shrink-0 text-base text-stone-400 transition-colors duration-200 group-hover:text-[var(--brand)]" />
                                                <span lang="de" className="min-w-0 hyphens-auto break-words font-inter text-[15px] font-normal text-stone-600 transition-colors duration-200 group-hover:text-ink sm:text-base">
                                                    {name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
