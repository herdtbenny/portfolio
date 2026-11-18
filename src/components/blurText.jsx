import { useEffect, useMemo, useRef, useState } from 'react';

// Letters or words fade in from a blur, one after another, once the text scrolls into view.
function BlurText({ text, delay = 50, animateBy = 'words', direction = 'top', as: Tag = 'p', className = '', style }) {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const segments = useMemo(() => (animateBy === 'words' ? text.split(' ') : text.split('')), [text, animateBy]);

    return (
        <Tag ref={ref} className={`inline-flex flex-wrap ${className}`} style={style} aria-label={text}>
            {segments.map((segment, i) => (
                <span
                    // segments repeat ("N" in BENNY), so the index is part of the key
                    key={`${segment}-${i}`}
                    aria-hidden
                    className="inline-block motion-reduce:!transform-none motion-reduce:!blur-0 motion-reduce:!opacity-100"
                    style={{
                        filter: inView ? 'blur(0px)' : 'blur(10px)',
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : `translateY(${direction === 'top' ? '-20px' : '20px'})`,
                        transition: `filter 0.5s ease-out ${i * delay}ms, opacity 0.5s ease-out ${i * delay}ms, transform 0.5s ease-out ${i * delay}ms`,
                    }}
                >
                    {segment}
                    {animateBy === 'words' && i < segments.length - 1 ? ' ' : ''}
                </span>
            ))}
        </Tag>
    );
}

export default BlurText;
