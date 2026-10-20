import useInView from '../hooks/useInView';
import RevealLine from '../components/revealLine';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

const fadeUp = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

// newest first; `current` marks the station that is still ongoing
const stations = [
    {
        period: 'seit 09/2025',
        title: 'Praktikant → Werkstudent',
        place: 'IMPECT GmbH, Köln',
        detail: 'Praktikum (09/2025 – 01/2026), seither Werkstudent — Softwarelösungen für Fußballdatenanalyse',
        tag: 'Job',
        current: true,
    },
    {
        period: '10/2023 – vsl. 09/2027',
        title: 'Bachelor Wirtschaftsinformatik',
        place: 'OTH Regensburg',
        tag: 'Studium',
        current: true,
    },
    {
        period: '2022 – 2025',
        title: 'Werkstudent & Trainer',
        place: 'SSV Jahn Regensburg',
        tag: 'Verein',
    },
];

function Dot({ current }) {
    return (
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            {current && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40 motion-reduce:animate-none" />}
            <span
                className={`relative h-3.5 w-3.5 rounded-full border-2 ${
                    current ? 'border-accent bg-accent' : 'border-white/40 bg-black'
                }`}
            />
        </span>
    );
}

function Timeline() {
    const [ref, inView] = useInView();

    return (
        <section
            id="lebenslauf"
            className="relative box-border overflow-hidden bg-[#000000] px-5 pb-20 pt-28 font-syne sm:px-12 sm:pb-28 sm:pt-32 lg:px-20 lg:pt-36"
        >
            <div ref={ref} className="relative mx-auto w-full max-w-[1200px]">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
                    <div>
                        <p className="m-0 mb-3.5 font-inter text-xs font-semibold uppercase tracking-[3px] text-accent">
                            <RevealLine inView={inView} delay={0}>Stationen</RevealLine>
                        </p>
                        <h2 className="m-0 text-3xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                            <RevealLine inView={inView} delay={120}>Lebenslauf</RevealLine>
                        </h2>
                    </div>
                    <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600" style={fadeUp(inView, 0.25)}>
                        2022 – heute
                    </p>
                </header>

                <div className="relative">
                    {/* the line draws itself top to bottom; left on mobile, centered from md up */}
                    <div className="absolute bottom-0 left-[6px] top-0 w-px md:left-1/2 md:-translate-x-1/2">
                        <div
                            className="h-full w-full origin-top bg-gradient-to-b from-white/30 via-white/15 to-transparent"
                            style={{
                                transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                                transition: `transform 1.4s ${EASE} 0.2s`,
                            }}
                        />
                    </div>

                    <ol className="m-0 flex list-none flex-col gap-20 p-0 sm:gap-32">
                        {stations.map((item, i) => {
                            const contentLeft = i % 2 === 0;
                            return (
                                <li
                                    key={item.title}
                                    className="group relative grid grid-cols-[14px_1fr] gap-x-6 md:grid-cols-[1fr_14px_1fr] md:gap-x-20"
                                    style={fadeUp(inView, 0.3 + i * 0.15)}
                                >
                                    <div className="col-start-1 row-span-2 pt-2 md:col-start-2 md:row-start-1">
                                        <Dot current={item.current} />
                                    </div>

                                    {/* period + tag: above the content on mobile, opposite side of the line from md up */}
                                    <div
                                        className={`col-start-2 row-start-1 mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] md:mb-0 md:pt-1.5 ${
                                            contentLeft ? 'md:col-start-3' : 'md:col-start-1 md:flex-row-reverse md:text-right'
                                        }`}
                                    >
                                        <span className="text-neutral-300">{item.period}</span>
                                        <span className="h-px w-6 bg-white/15" />
                                        <span className="text-accent/80">{item.tag}</span>
                                    </div>

                                    <div
                                        className={`col-start-2 row-start-2 md:row-start-1 ${
                                            contentLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3'
                                        }`}
                                    >
                                        <p className="m-0 mb-1.5 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                                            {item.title}
                                        </p>
                                        <p className="m-0 font-inter text-sm text-neutral-400">{item.place}</p>
                                        {item.detail && (
                                            <p className={`m-0 mt-2 max-w-[44ch] font-inter text-sm leading-relaxed text-neutral-600 ${contentLeft ? 'md:ml-auto' : ''}`}>
                                                {item.detail}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default Timeline;
