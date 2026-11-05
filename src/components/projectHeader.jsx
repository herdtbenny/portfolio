import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

// sticky top bar shared by the standalone project pages
function ProjectHeader({ title, subtitle, accent, icon }) {
    return (
        <header className="sticky top-0 z-30 border-b border-p-fg/[0.06] bg-p-panel/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-8">
                <Link
                    to="/#projects"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-p-sm border border-p-fg/[0.06] text-p-muted no-underline transition-colors hover:bg-p-fg/[0.06] hover:text-p-fg"
                    title="Zurück zum Portfolio"
                    aria-label="Zurück zum Portfolio"
                >
                    <FiArrowLeft />
                </Link>
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-p-sm text-base"
                    style={{ background: `${accent}26`, color: accent }}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="m-0 truncate font-p-display text-sm font-bold tracking-tight text-p-fg sm:text-base">{title}</p>
                    <p className="m-0 truncate font-p-mono text-[10px] uppercase tracking-wider" style={{ color: accent }}>{subtitle}</p>
                </div>
            </div>
        </header>
    );
}

export default ProjectHeader;
