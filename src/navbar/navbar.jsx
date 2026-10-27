import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ACTIVE_SECTION_OFFSET_RATIO = 0.35;

const navItems = [
    { label: 'Start', id: 'hero' },
    { label: 'Über mich', id: 'about' },
    { label: 'Profil', id: 'profil' },
    { label: 'Lebenslauf', id: 'lebenslauf' },
    { label: 'Projekte', id: 'projects' },
    { label: 'Kontakt', id: 'kontakt' },
];

const glassStyle = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.10),
    0 8px 32px rgba(0, 0, 0, 0.20)
  `,
};

function NavBtn({ item, active, onClick, mobile = false }) {
    return (
        <button
            onClick={onClick}
            className={
                mobile
                    ? 'w-full rounded-2xl px-5 py-3.5 text-center text-base font-medium tracking-wide transition-[color,background,transform] duration-200 ease-out active:scale-[0.97]'
                    : 'rounded-full px-3.5 py-2 text-xs font-medium tracking-wide transition-[color,background,transform] duration-200 ease-out active:scale-[0.95] lg:px-5 lg:text-sm'
            }
            style={{
                color: active ? '#F2F2F0' : 'rgba(255,255,255,0.45)',
                background: active
                    ? 'linear-gradient(135deg, rgba(242,242,240,0.12), rgba(242,242,240,0.06))'
                    : 'transparent',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = active ? '#F2F2F0' : 'rgba(255,255,255,0.45)'; }}
        >
            {item.label}
        </button>
    );
}

function Navbar({ scrollTo }) {
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const offset = window.innerHeight * ACTIVE_SECTION_OFFSET_RATIO;
                let current = navItems[0].id;
                for (const item of navItems) {
                    const el = document.getElementById(item.id);
                    if (el && el.getBoundingClientRect().top <= offset) {
                        current = item.id;
                    }
                }
                setActiveSection(current);

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

    const handleScrollTo = (id) => {
        scrollTo(id);
        setMobileOpen(false);
    };

    const navEntranceStyle = {
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-16px)',
        transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
    };
    const hamburgerEntranceStyle = {
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
    };

    return (
        <>
            {/* Desktop pill nav */}
            <nav className="fixed left-1/2 top-5 z-50 hidden w-auto whitespace-nowrap font-syne md:block" style={navEntranceStyle}>
                <div className="relative flex flex-col overflow-hidden rounded-[2rem]" style={glassStyle}>

                    {/* Specular top-edge gloss */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-px"
                        style={{ background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 75%, transparent 100%)' }}
                    />

                    <ul className="m-0 flex list-none items-center justify-center gap-1 px-2 py-2 lg:gap-3">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <NavBtn item={item} active={activeSection === item.id} onClick={() => scrollTo(item.id)} />
                            </li>
                        ))}
                        <li>
                            <Link
                                to="/aufschluesselung"
                                className="block rounded-full bg-white px-3.5 py-2 text-xs font-semibold tracking-wide text-black no-underline transition-[background,transform] duration-200 ease-out hover:bg-accent active:scale-[0.95] lg:px-5 lg:text-sm"
                            >
                                Für Recruiter
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile/tablet hamburger — pinned to the top-right corner of the screen */}
            <div className="fixed right-5 top-6 z-50 md:hidden" style={hamburgerEntranceStyle}>
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
                    aria-expanded={mobileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-[color,transform] duration-150 ease-out hover:text-white active:scale-90"
                    style={glassStyle}
                >
                    {mobileOpen ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile dropdown — full width, under the hamburger */}
            <div
                className={`fixed inset-x-5 top-[76px] z-40 overflow-hidden rounded-[1.75rem] font-syne transition-all duration-300 ease-out md:hidden ${
                    mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
                style={glassStyle}
            >
                <div className="flex flex-col items-center gap-1 p-3">
                    {navItems.map((item) => (
                        <NavBtn key={item.id} item={item} active={activeSection === item.id} onClick={() => handleScrollTo(item.id)} mobile />
                    ))}
                    <Link
                        to="/aufschluesselung"
                        className="mt-1 w-full rounded-2xl bg-white px-5 py-3.5 text-center text-base font-semibold tracking-wide text-black no-underline active:scale-[0.97]"
                    >
                        Für Recruiter
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Navbar;
