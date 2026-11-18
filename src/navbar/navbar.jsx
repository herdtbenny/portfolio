import { useEffect, useRef, useState } from 'react';
import { FiDownload, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const ACTIVE_SECTION_OFFSET_RATIO = 0.35;

const navItems = [
    { label: 'Start', id: 'hero' },
    { label: 'Über mich', id: 'about' },
    { label: 'Lebenslauf', id: 'lebenslauf' },
    { label: 'Projekte', id: 'projects' },
    { label: 'Kontakt', id: 'kontakt' },
];

// the class is set before first paint in public/index.html; this keeps it and the stored choice in sync
function useTheme() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const toggle = () => {
        const next = !dark;
        document.documentElement.classList.toggle('dark', next);
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
        setDark(next);
    };
    return [dark, toggle];
}

// sun and moon sit in the track, the knob slides over the inactive one and shows the active one
export function ThemeToggle({ className = '' }) {
    const [dark, toggle] = useTheme();
    const KnobIcon = dark ? FiMoon : FiSun;
    return (
        <button
            type="button"
            onClick={toggle}
            className={`relative h-8 w-16 shrink-0 rounded-full bg-ink/15 transition-opacity hover:opacity-80 ${className}`}
            aria-label={dark ? 'Helles Design einschalten' : 'Dunkles Design einschalten'}
            title={dark ? 'Helles Design' : 'Dunkles Design'}
        >
            <FiSun className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" aria-hidden />
            <FiMoon className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" aria-hidden />
            <span
                className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-300"
                style={{ transform: dark ? 'translateX(2rem)' : 'translateX(0)' }}
            >
                <KnobIcon className="h-3.5 w-3.5" aria-hidden />
            </span>
        </button>
    );
}

function Navbar({ scrollTo }) {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [scrolled, setScrolled] = useState(false);
    const buttonRef = useRef(null);
    const firstItemRef = useRef(null);

    useEffect(() => {
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const offset = window.innerHeight * ACTIVE_SECTION_OFFSET_RATIO;
                let current = navItems[0].id;
                for (const item of navItems) {
                    const el = document.getElementById(item.id);
                    if (el && el.getBoundingClientRect().top <= offset) current = item.id;
                }
                setActiveSection(current);
                setScrolled(window.scrollY > 24);
                raf = null;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    // while the side menu is open: Escape closes it, the page behind doesn't scroll, focus moves in
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
        };
        document.addEventListener('keydown', onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        firstItemRef.current?.focus({ preventScroll: true });
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
        };
    }, [open]);

    const go = (id) => {
        setOpen(false);
        scrollTo(id);
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 px-4 py-4 transition-[background-color,backdrop-filter] duration-300 sm:px-6 sm:py-5 ${
                    scrolled ? 'bg-cream/80 backdrop-blur-md' : 'bg-transparent'
                }`}
            >
                <nav className="mx-auto flex max-w-screen-2xl items-center justify-between" aria-label="Hauptnavigation">
                    <button
                        ref={buttonRef}
                        type="button"
                        className="p-2 text-stone-500 transition-colors duration-300 hover:text-ink"
                        aria-label="Menü öffnen"
                        aria-expanded={open}
                        aria-controls="site-menu"
                        onClick={() => setOpen(true)}
                    >
                        <FiMenu className="h-8 w-8" strokeWidth={2} />
                    </button>

                    <button
                        type="button"
                        onClick={() => go('hero')}
                        className="font-signature text-4xl leading-none text-ink"
                        aria-label="Benny Herdt – nach oben"
                    >
                        B
                    </button>

                    <ThemeToggle />
                </nav>
            </header>

            {/* side menu: full height from the left, with a dimmed page behind it */}
            <div
                className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={() => setOpen(false)}
                aria-hidden
            />
            <aside
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menü"
                aria-hidden={!open}
                inert={!open}
                className={`fixed inset-y-0 left-0 z-[70] flex w-[min(88vw,420px)] flex-col bg-cream px-6 pb-8 pt-5 shadow-2xl ring-1 ring-ink/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 sm:pt-6 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="font-signature text-4xl leading-none text-ink">B</span>
                    <button
                        type="button"
                        onClick={() => { setOpen(false); buttonRef.current?.focus(); }}
                        className="p-2 text-stone-500 transition-colors duration-300 hover:text-ink"
                        aria-label="Menü schließen"
                    >
                        <FiX className="h-8 w-8" strokeWidth={2} />
                    </button>
                </div>

                <ul className="m-0 mt-14 flex list-none flex-col gap-1 p-0 sm:mt-20">
                    {navItems.map((item, i) => {
                        const active = activeSection === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    ref={i === 0 ? firstItemRef : undefined}
                                    type="button"
                                    onClick={() => go(item.id)}
                                    aria-current={active ? 'true' : undefined}
                                    className={`group flex w-full items-baseline gap-4 py-2 text-left font-serif text-3xl font-bold uppercase tracking-tight transition-colors duration-300 hover:text-accent-deep sm:text-4xl ${
                                        active ? 'text-accent-deep' : 'text-ink'
                                    }`}
                                >
                                    <span className="font-mono text-xs font-normal text-stone-500">{String(i + 1).padStart(2, '0')}</span>
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto border-t border-ink/10 pt-6">
                    <a
                        href="/Lebenslauf_DE.pdf"
                        download="Lebenslauf_Benny_Herdt.pdf"
                        className="group inline-flex items-center gap-2.5 font-inter text-sm font-semibold text-ink no-underline transition-colors hover:text-accent-deep"
                    >
                        <FiDownload className="transition-transform duration-200 group-hover:translate-y-0.5" />
                        Lebenslauf herunterladen (PDF)
                    </a>
                    <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Benny Herdt · Regensburg</p>
                </div>
            </aside>
        </>
    );
}

export default Navbar;
