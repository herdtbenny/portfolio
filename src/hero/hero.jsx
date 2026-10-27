import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import useInView from "../hooks/useInView";
import RevealLine from "../components/revealLine";

const roles = ["Entwickler", "Gründer", "Sports Tech"];

const fadeIn = (inView, delay) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(12px)',
    transitionDelay: `${delay}ms`,
});

function Hero() {
    const [ref, inView] = useInView();
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = roles[roleIndex];
        let timeout;
        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setRoleIndex((i) => (i + 1) % roles.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, roleIndex]);

    return (
        <section
            id="hero"
            ref={ref}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24 font-syne sm:px-12 lg:px-20"
        >
            {/* darkens the video so text stays legible */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

            <div className="relative z-10 -mt-[24vh] flex flex-col items-center text-center">
                <h1 className="m-0 flex flex-wrap justify-center gap-x-[0.25em] whitespace-nowrap text-[12vw] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-8xl lg:text-9xl">
                    <RevealLine inView={inView} delay={0} className="pb-[0.05em]">Benny</RevealLine>
                    <RevealLine inView={inView} delay={120} className="pb-[0.05em]"><span className="text-white/65">Herdt</span></RevealLine>
                </h1>
            </div>

            {/* role + subline are anchored to the bottom so the name stays centered */}
            <div className="absolute inset-x-0 bottom-24 z-10 flex flex-col items-center px-5 text-center sm:bottom-32">
                <div
                    className="flex h-[1.2em] items-center text-3xl font-bold tracking-tight text-accent transition-[opacity,transform] duration-700 ease-out sm:text-5xl lg:text-6xl"
                    style={fadeIn(inView, 300)}
                >
                    {displayed}
                    <span className="ml-2 inline-block h-[0.9em] w-[3px] animate-blink bg-accent" />
                </div>

                <p
                    className="m-0 mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400 transition-[opacity,transform] duration-700 ease-out sm:text-xs"
                    style={fadeIn(inView, 450)}
                >
                    Wirtschaftsinformatik · Werkstudent bei IMPECT · Gründer von Webs by Benny
                </p>

                <div
                    className="mt-9 flex flex-wrap items-center justify-center gap-3 transition-[opacity,transform] duration-700 ease-out"
                    style={fadeIn(inView, 600)}
                >
                    <button
                        type="button"
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 font-inter text-sm font-semibold text-black transition-[background,transform] duration-200 ease-out hover:bg-accent active:scale-[0.97]"
                    >
                        Projekte ansehen
                        <FiArrowDown className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    </button>
                    <Link
                        to="/aufschluesselung"
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 font-inter text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors duration-200 hover:border-white/50"
                    >
                        Für Recruiter
                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>

            {/* scroll indicator */}
            <div
                className="absolute bottom-10 left-1/2 z-10 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-white/10 transition-opacity duration-700 sm:block"
                style={{ opacity: inView ? 1 : 0, transitionDelay: '600ms' }}
            >
                <span className="block h-1/2 w-full animate-scrollLine bg-white/60" />
            </div>
        </section>
    );
}

export default Hero;
