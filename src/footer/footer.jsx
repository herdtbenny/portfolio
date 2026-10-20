import { FiArrowUp } from 'react-icons/fi';

const links = [
    { label: 'E-Mail', href: 'mailto:herdtbenny@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/herdtbenny' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/benny-herdt' },
];

function Footer() {
    return (
        <footer className="bg-[#000000] px-5 pb-10 font-inter sm:px-12 lg:px-20">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    © {new Date().getFullYear()} Benny Herdt
                </p>

                <ul className="m-0 flex list-none gap-6 p-0">
                    {links.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-sm text-neutral-400 no-underline transition-colors duration-200 hover:text-white"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group inline-flex items-center gap-2 self-start border-0 bg-transparent p-0 text-sm text-neutral-400 transition-colors duration-200 hover:text-white sm:self-auto"
                >
                    Nach oben
                    <FiArrowUp className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
