import { FiArrowDown, FiBookOpen, FiBriefcase, FiCode, FiDownload, FiMail, FiMapPin } from "react-icons/fi";
import useInView from "../hooks/useInView";
import RevealLine from "../components/revealLine";

// one flowing banner: hard facts from the CV first (with icons), then the roles
const bannerItems = [
    { Icon: FiMapPin, label: 'Regensburg' },
    { Icon: FiBriefcase, label: 'Werkstudent bei IMPECT' },
    { Icon: FiBookOpen, label: 'B.Sc. Wirtschaftsinformatik · Ø 1,8' },
    { Icon: FiCode, label: 'Java · Angular · React · TypeScript' },
    { label: 'Full-Stack' },
    { label: 'Agentic Coding' },
    { label: 'Product Thinking' },
    { label: 'Data & Analytics' },
    { label: 'Webentwicklung' },
];

const fadeIn = (inView, delay) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(12px)',
    transitionDelay: `${delay}ms`,
});

function Hero() {
    const [ref, inView] = useInView();

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section
            id="hero"
            ref={ref}
            className="relative flex min-h-[100svh] flex-col overflow-hidden font-serif"
        >
            {/* darkens the video so text stays legible */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-black/35 to-black/80" />

            {/* greeting + name sit in the upper part of the screen */}
            <div className="relative z-10 flex flex-col items-center px-5 pt-[16vh] text-center sm:px-12 sm:pt-[18vh] lg:px-20">
                <p
                    className="m-0 mb-5 font-inter text-sm font-medium text-white/80 transition-[opacity,transform] duration-700 ease-out sm:text-base"
                    style={fadeIn(inView, 0)}
                >
                    <span className="mr-2 inline-block origin-[70%_70%] animate-wave motion-reduce:animate-none" aria-hidden>👋</span>
                    Hallo und herzlich willkommen, ich bin
                </p>

                <h1 className="m-0 flex flex-wrap justify-center gap-x-[0.25em] whitespace-nowrap text-[13vw] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-8xl lg:text-[8.5rem]">
                    <RevealLine inView={inView} delay={80}>Benny</RevealLine>
                    <RevealLine inView={inView} delay={200}><span className="text-white/65">Herdt</span></RevealLine>
                </h1>
            </div>

            {/* subtitle, banner and actions are grouped in the lower part */}
            <div className="relative z-10 mt-auto flex flex-col items-center pb-[12vh] pt-16 text-center sm:pb-[14vh]">
                <p
                    className="m-0 mb-8 max-w-4xl text-balance px-5 font-inter text-base leading-relaxed text-white/85 transition-[opacity,transform] duration-700 ease-out sm:px-12 sm:text-lg"
                    style={fadeIn(inView, 350)}
                >
                    Wirtschaftsinformatik-Student an der OTH Regensburg und Werkstudent in der Softwareentwicklung bei IMPECT.
                </p>

                {/* the list is rendered twice so the loop is seamless */}
                <div
                    className="relative w-full overflow-hidden border-y border-accent/30 bg-accent/[0.08] py-3.5 backdrop-blur-md transition-opacity duration-700 ease-out sm:py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
                    style={{ opacity: inView ? 1 : 0, transitionDelay: '450ms', WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}
                    aria-label={bannerItems.map((item) => item.label).join(', ')}
                >
                    <div className="flex w-max animate-marquee motion-reduce:animate-none" aria-hidden>
                        {[0, 1].map((copy) => (
                            <ul key={copy} className="m-0 flex list-none items-center p-0">
                                {bannerItems.map(({ Icon, label }) => (
                                    <li key={label} className="flex items-center whitespace-nowrap font-inter text-xs font-medium uppercase tracking-[0.24em] text-cream sm:text-sm">
                                        {Icon && <Icon className="mr-2.5 text-[1.1em] text-accent" />}
                                        {label}
                                        <span className="mx-7 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(143,176,255,0.7)] sm:mx-10" />
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>

                <div
                    className="mt-9 flex flex-wrap items-center justify-center gap-3 px-5 transition-[opacity,transform] duration-700 ease-out"
                    style={fadeIn(inView, 600)}
                >
                    <a
                        href="/Lebenslauf_Benny_Herdt.pdf"
                        download="Lebenslauf_Benny_Herdt.pdf"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 font-inter text-sm font-semibold text-black no-underline transition-[background,transform] duration-200 ease-out hover:bg-accent active:scale-[0.97]"
                    >
                        <FiDownload className="transition-transform duration-200 group-hover:translate-y-0.5" />
                        Lebenslauf (PDF)
                    </a>
                    <button
                        type="button"
                        onClick={() => scrollTo('projects')}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/20 px-5 py-3 font-inter text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:border-white/60"
                    >
                        Projekte ansehen
                        <FiArrowDown className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollTo('kontakt')}
                        className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/20 px-5 py-3 font-inter text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:border-white/60"
                    >
                        <FiMail />
                        Kontakt
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Hero;
