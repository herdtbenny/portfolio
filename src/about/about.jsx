import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import {
    SiAngular,
    SiTypescript,
    SiReact,
    SiCypress,
    SiGit,
    SiPostgresql,
    SiTailwindcss,
    SiNextdotjs,
    SiSupabase,
    SiVercel, SiDocker, SiNodedotjs,
    SiCloudflare, SiPostman, SiClaude, SiAnthropic, SiModelcontextprotocol,
    SiC, SiSwagger, SiJest, SiSonarqubeserver, SiSentry
} from 'react-icons/si';
import { FiBox, FiClipboard, FiGitMerge, FiLayout, FiMessageSquare, FiServer, FiTarget } from 'react-icons/fi';

import {FaJava} from 'react-icons/fa';
import OrgLinks from '../components/orgLinks';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

// Mirrors the "Kenntnisse" block of public/Lebenslauf_DE.pdf: same groups, order and names
// (languages live in the Lebenslauf section). Icons stay neutral and take their brand color on hover.
const skillGroups = [
    {
        label: 'Entwicklung',
        skills: [
            {name: 'TypeScript', Icon: SiTypescript, color: '#3178c6'},
            {name: 'React', Icon: SiReact, color: '#61dafb'},
            {name: 'Next.js', Icon: SiNextdotjs, color: 'rgb(var(--fg))'},
            {name: 'Node.js', Icon: SiNodedotjs, color: '#3c873a'},
            {name: 'Angular', Icon: SiAngular, color: '#dd0031'},
            {name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38bdf8'},
            {name: 'Java', Icon: FaJava, color: '#f89820'},
            {name: 'C', Icon: SiC, color: '#a8b9cc'},
        ],
    },
    {
        label: 'Backend & Daten',
        skills: [
            {name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1'},
            {name: 'Supabase', Icon: SiSupabase, color: '#3ecf8e'},
            {name: 'REST-APIs', Icon: FiServer, color: 'rgb(var(--fg))'},
            {name: 'Swagger/OpenAPI', Icon: SiSwagger, color: '#6ba539'},
            {name: 'Microservices', Icon: FiBox, color: 'rgb(var(--fg))'},
            {name: 'Docker', Icon: SiDocker, color: '#2496ed'},
        ],
    },
    {
        label: 'Testing & Tools',
        skills: [
            {name: 'Cypress', Icon: SiCypress, color: 'rgb(var(--fg))'},
            {name: 'Jest', Icon: SiJest, color: '#c21325'},
            {name: 'Git', Icon: SiGit, color: '#f05032'},
            {name: 'Postman', Icon: SiPostman, color: '#ff6c37'},
            {name: 'Vercel', Icon: SiVercel, color: 'rgb(var(--fg))'},
            {name: 'Cloudflare', Icon: SiCloudflare, color: '#f38020'},
            {name: 'SonarQube', Icon: SiSonarqubeserver, color: '#126ed3'},
            {name: 'Sentry', Icon: SiSentry, color: 'rgb(var(--fg))'},
        ],
    },
    {
        label: 'KI-Entwicklung',
        skills: [
            {name: 'Prompt Engineering', Icon: FiMessageSquare, color: 'rgb(var(--fg))'},
            {name: 'Claude Code', Icon: SiClaude, color: '#d97757'},
            {name: 'Agent Skills', Icon: SiAnthropic, color: 'rgb(var(--fg))'},
            {name: 'MCP', Icon: SiModelcontextprotocol, color: 'rgb(var(--fg))'},
        ],
    },
    {
        label: 'Methoden',
        skills: [
            {name: 'Anforderungsanalyse', Icon: FiClipboard, color: 'rgb(var(--fg))'},
            {name: 'Geschäftsprozessmodellierung', Icon: FiGitMerge, color: 'rgb(var(--fg))'},
            {name: 'Projektmanagement', Icon: FiTarget, color: 'rgb(var(--fg))'},
            {name: 'UI/UX-Design', Icon: FiLayout, color: 'rgb(var(--fg))'},
        ],
    },
];

const sectionLabel = 'm-0 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500';

function About() {
    const [ref, inView] = useInView();

    return (
        <section
            id="about"
            className="relative box-border overflow-clip bg-cream px-5 pb-20 pt-28 font-serif sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(68,114,196,0.06)_0%,transparent_70%)] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]" />

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

                <div>
                    {/* TECH STACK: one category per row, heading left, tools in a column grid right */}
                    <div>
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
                                    className="grid grid-cols-1 items-baseline gap-4 border-t border-ink/10 py-6 sm:grid-cols-[220px_1fr] sm:gap-8 sm:py-8"
                                    style={fadeUp(inView, 0.08 + i * 0.08)}
                                >
                                    {/* category as a serif heading, tools stay lighter sans, so the two levels read apart */}
                                    <h3 className="m-0 font-serif text-xl font-medium leading-tight tracking-tight text-ink sm:text-2xl">
                                        {group.label}
                                    </h3>
                                    <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0 md:grid-cols-3 xl:grid-cols-4">
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
