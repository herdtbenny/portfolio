import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';

// sticky top bar shared by the standalone project pages
function ProjectHeader({ title, subtitle, accent, icon, caseStudyId }) {
    return (
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-8">
                <Link
                    to="/#projects"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-neutral-400 no-underline transition-colors hover:bg-white/[0.06] hover:text-white"
                    title="Zurück zum Portfolio"
                    aria-label="Zurück zum Portfolio"
                >
                    <FiArrowLeft />
                </Link>
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
                    style={{ background: `${accent}26`, color: accent }}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="m-0 truncate font-syne text-sm font-bold tracking-tight text-white sm:text-base">{title}</p>
                    <p className="m-0 truncate font-mono text-[10px] uppercase tracking-wider" style={{ color: accent }}>{subtitle}</p>
                </div>
                {caseStudyId && (
                    <Link
                        to={`/aufschluesselung#${caseStudyId}`}
                        className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400 no-underline transition-colors hover:border-white/25 hover:text-white sm:px-4"
                    >
                        <FiFileText />
                        <span className="hidden sm:inline">Case Study</span>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default ProjectHeader;
