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
    SiVercel, SiDocker, SiNodedotjs,
    SiCloudflare, SiFormspree, SiPostman
} from 'react-icons/si';

import {FaJava} from 'react-icons/fa';

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
            {name: 'Angular', Icon: SiAngular, color: '#dd0031'},
            {name: 'TypeScript', Icon: SiTypescript, color: '#3178c6'},
            {name: 'HTML', Icon: SiHtml5, color: '#e34f26'},
            {name: 'Tailwind', Icon: SiTailwindcss, color: '#38bdf8'},
        ],
    },
    {
        label: 'Backend',
        skills: [
            {name: 'Java', Icon: FaJava, color: '#f89820'},
            {name: 'Node.js', Icon: SiNodedotjs, color: '#3c873a'},
            {name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1'},
        ],
    },
    {
        label: 'Tools',
        skills: [
            {name: 'Git', Icon: SiGitlab, color: '#fc6d26'},
            {name: 'Docker', Icon: SiDocker, color: '#2496ed'},
            {name: 'Vercel', Icon: SiVercel, color: '#ffffff'},
            {name: 'Cloudflare', Icon: SiCloudflare, color: '#f38020'},
            {name: 'Formspree', Icon: SiFormspree, color: '#90fe66'},
            {name: 'Cypress', Icon: SiCypress, color: '#ffffff'},
            {name: 'Postman', Icon: SiPostman, color: '#ff6c37'},
        ],
    },
];

const sectionLabel = 'm-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500';

function About() {
    const [ref, inView] = useInView();

    return (
        <section
            id="about"
            className="relative box-border overflow-hidden bg-[#000000] px-5 pb-20 pt-28 font-syne sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.08)_0%,transparent_70%)] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]" />

            <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent">
                            <RevealLine inView={inView} delay={0}>Wer bin ich</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Über mich</RevealLine>
                        </h2>
                    </div>
                    <p className="m-0 max-w-xs font-inter text-sm leading-relaxed text-neutral-500" style={fadeUp(inView, 0.25)}>
                        Studium in Regensburg, Fußballdaten bei IMPECT und nebenbei Websites für lokale Betriebe.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">

                    {/* PHOTO: frameless, fades into the page */}
                    <figure className="relative m-0 lg:col-span-5" style={fadeUp(inView, 0.1)}>
                        <div className="pointer-events-none absolute inset-x-[5%] bottom-0 top-[15%] -z-0 rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.18)_0%,transparent_70%)] blur-3xl" />
                        <img
                            src={bennyImg}
                            alt="Benny Herdt"
                            className="relative mx-auto block h-auto max-h-[520px] w-full max-w-[420px] object-contain [filter:contrast(1.02)_brightness(1.02)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
                        />
                        <figcaption className="relative flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                            <span className="text-white">Benny Herdt</span>
                            <span>Regensburg / Köln</span>
                        </figcaption>
                    </figure>

                    {/* TECH STACK: label column + plain icon/name list, no pills */}
                    <div className="lg:col-span-7 lg:pt-4">
                        <div className="mb-6 flex items-baseline justify-between" style={fadeUp(inView)}>
                            <p className={sectionLabel}>Tech Stack</p>
                            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                                {skillGroups.reduce((n, g) => n + g.skills.length, 0)} Tools
                            </p>
                        </div>
                        <div className="border-b border-white/10">
                            {skillGroups.map((group, i) => (
                                <div
                                    key={group.label}
                                    className="grid grid-cols-1 gap-4 border-t border-white/10 py-6 sm:grid-cols-[140px_1fr] sm:gap-8 sm:py-7"
                                    style={fadeUp(inView, 0.08 + i * 0.08)}
                                >
                                    <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 sm:pt-1.5">
                                        <span className="mr-3 text-neutral-600">{String(i + 1).padStart(2, '0')}</span>
                                        {group.label}
                                    </p>
                                    <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-4 p-0">
                                        {group.skills.map(({name, Icon, color}) => (
                                            <li
                                                key={name}
                                                className="group flex items-center gap-2.5"
                                                style={{'--brand': color}}
                                            >
                                                <Icon className="text-lg text-neutral-500 transition-colors duration-200 group-hover:text-[var(--brand)]" />
                                                <span className="font-inter text-base font-medium text-neutral-300 transition-colors duration-200 group-hover:text-white sm:text-lg">
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
