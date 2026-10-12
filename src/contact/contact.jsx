import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvdvvwq';

const contactCards = [
    {
        label: 'E-Mail',
        desc: 'Allgemeine Anfragen & Kontakt',
        href: 'mailto:herdtbenny@gmail.com',
        icon: <FaEnvelope />,
    },
    {
        label: 'GitHub',
        desc: 'Code, Projekte & Repositories',
        href: 'https://github.com/herdtbenny',
        icon: <FaGithub />,
    },
    {
        label: 'LinkedIn',
        desc: 'Beruflicher Werdegang & Netzwerk',
        href: 'https://linkedin.com/in/benny-herdt',
        icon: <FaLinkedin />,
    },
];

const inputClasses = 'rounded-lg border border-white/10 bg-[#000000] px-4 py-2.5 font-inter text-sm text-white outline-none transition-colors focus:border-accent';
const labelClasses = 'font-inter text-xs font-semibold uppercase tracking-wider text-neutral-500';

function Contact() {
    const [ref, inView] = useInView();

    return (
        <section
            id="kontakt"
            ref={ref}
            className="relative box-border min-h-screen overflow-hidden bg-[#000000] px-5 pb-16 pt-28 font-syne sm:px-12 sm:pb-24 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div className="pointer-events-none absolute -right-28 -top-36 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(230,165,88,0.08)_0%,transparent_70%)] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />

            <div
                className="relative mx-auto w-full max-w-[1200px] transition-all duration-700 ease-out"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(40px)',
                }}
            >
                <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent">
                    <RevealLine inView={inView} delay={0}>Get in touch</RevealLine>
                </p>
                <h2 className="m-0 mb-12 text-3xl font-extrabold leading-none tracking-tight text-white sm:mb-16 sm:text-5xl">
                    <RevealLine inView={inView} delay={120}>Kontakt</RevealLine>
                </h2>

                <ul className="m-0 mb-20 list-none border-b border-white/10 p-0">
                    {contactCards.map((card, i) => (
                        <li key={card.label} className="border-t border-white/10">
                            <a
                                href={card.href}
                                target={card.href.startsWith('http') ? '_blank' : undefined}
                                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="group flex items-center gap-5 py-6 no-underline sm:gap-8 sm:py-8"
                            >
                                <span className="w-6 font-mono text-[11px] text-neutral-600">{String(i + 1).padStart(2, '0')}</span>
                                <span className="text-lg text-neutral-500 transition-colors duration-200 group-hover:text-accent sm:text-xl">{card.icon}</span>
                                <span className="text-2xl font-extrabold tracking-tight text-white transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none sm:text-4xl">
                                    {card.label}
                                </span>
                                <span className="ml-auto hidden font-inter text-sm text-neutral-500 sm:block">{card.desc}</span>
                                <FiArrowUpRight className="ml-auto shrink-0 text-xl sm:ml-0 text-neutral-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                            </a>
                        </li>
                    ))}
                </ul>

                <p className="mb-7 font-inter text-[11px] font-semibold uppercase tracking-[3px] text-accent">Nachricht senden</p>
                <form
                    action={FORMSPREE_ENDPOINT}
                    method="POST"
                    className="flex w-full flex-col gap-4 rounded-[26px] border border-white/[0.06] bg-[#0a0a0a] p-7 sm:p-8"
                >
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className={labelClasses}>Name</label>
                        <input id="name" name="name" type="text" required className={inputClasses} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className={labelClasses}>E-Mail</label>
                        <input id="email" name="email" type="email" required className={inputClasses} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="message" className={labelClasses}>Nachricht</label>
                        <textarea id="message" name="message" rows={5} required className={`resize-none ${inputClasses}`} />
                    </div>
                    <button
                        type="submit"
                        className="mt-2 self-start rounded-xl border border-white/10 bg-amber-500/[0.12] px-6 py-3 font-inter text-sm font-semibold text-accent transition-all duration-200 hover:-translate-y-0.5 hover:border-accent"
                    >
                        Nachricht senden →
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Contact;
