import { useState } from 'react';
import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowUpRight, FiArrowRight, FiCheck } from 'react-icons/fi';

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

// label sits inside the field and floats up once it is focused or filled (placeholder=" " drives :placeholder-shown)
function Field({ id, label, type = 'text', textarea = false, className = '' }) {
    const fieldClasses =
        'peer block w-full resize-none border-0 border-b border-white/15 bg-transparent px-0 pb-2 pt-5 font-inter text-base text-white outline-none transition-colors duration-200 focus:border-accent';
    const Tag = textarea ? 'textarea' : 'input';
    return (
        <div className={`relative ${className}`}>
            <Tag id={id} name={id} type={textarea ? undefined : type} rows={textarea ? 2 : undefined} required placeholder=" " className={`${fieldClasses} ${textarea ? 'h-full min-h-[4.5rem]' : ''}`} />
            <label
                htmlFor={id}
                className="pointer-events-none absolute left-0 top-1 font-inter text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-accent"
            >
                {label}
            </label>
        </div>
    );
}

function Contact() {
    const [ref, inView] = useInView();
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setStatus('sending');
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error(res.statusText);
            form.reset();
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    return (
        <section
            id="kontakt"
            ref={ref}
            className="relative box-border min-h-screen overflow-hidden bg-[#000000] px-5 pb-16 pt-28 font-syne sm:px-12 sm:pb-24 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div className="pointer-events-none absolute -right-28 -top-36 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(143,176,255,0.08)_0%,transparent_70%)] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />

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

                <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:items-stretch lg:gap-16">
                    {/* DIRECT CHANNELS */}
                    <ul className="m-0 list-none border-b border-white/10 p-0 lg:col-span-5">
                        {contactCards.map((card, i) => (
                            <li key={card.label} className="border-t border-white/10">
                                <a
                                    href={card.href}
                                    target={card.href.startsWith('http') ? '_blank' : undefined}
                                    rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="group flex items-center gap-5 py-6 no-underline sm:py-7"
                                >
                                    <span className="w-6 font-mono text-[11px] text-neutral-600">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-lg text-neutral-500 transition-colors duration-200 group-hover:text-accent">{card.icon}</span>
                                    <span className="flex flex-col">
                                        <span className="text-2xl font-extrabold tracking-tight text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none sm:text-3xl">
                                            {card.label}
                                        </span>
                                        <span className="mt-1 font-inter text-xs text-neutral-500">{card.desc}</span>
                                    </span>
                                    <FiArrowUpRight className="ml-auto shrink-0 text-xl text-neutral-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* FORM */}
                    <form
                        action={FORMSPREE_ENDPOINT}
                        method="POST"
                        onSubmit={handleSubmit}
                        className="relative flex flex-col gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm sm:p-7 lg:col-span-7"
                    >
                        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">Nachricht senden</p>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
                            <Field id="name" label="Name" />
                            <Field id="email" label="E-Mail" type="email" />
                        </div>
                        <Field id="message" label="Nachricht" textarea className="flex-1" />

                        <div className="flex flex-wrap items-center gap-5">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-inter text-sm font-semibold text-black transition-[background,transform] duration-200 ease-out hover:bg-accent active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
                            >
                                {status === 'sending' ? 'Wird gesendet…' : 'Nachricht senden'}
                                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                            <p aria-live="polite" className="m-0 font-inter text-sm">
                                {status === 'sent' && (
                                    <span className="inline-flex items-center gap-2 text-accent"><FiCheck /> Danke, ich melde mich!</span>
                                )}
                                {status === 'error' && (
                                    <span className="text-red-400">Das hat nicht geklappt, schreib mir gern direkt per Mail.</span>
                                )}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;
