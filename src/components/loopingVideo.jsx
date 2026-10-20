import { useEffect, useRef, useState } from 'react';

const CROSSFADE_SECONDS = 1.2;

// Two overlapping <video> elements crossfade into each other right before the
// loop point, masking the hard jump-cut a plain `loop` attribute produces.
function LoopingVideo({ src, poster, className = '', style }) {
    const aRef = useRef(null);
    const bRef = useRef(null);
    const activeRef = useRef('a');

    // data saver or reduced motion: show the still frame only, skip the download
    const [stillOnly] = useState(() =>
        typeof window !== 'undefined' &&
        (navigator.connection?.saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );

    useEffect(() => {
        const a = aRef.current;
        const b = bRef.current;
        if (!a || !b) return;

        // the standby copy only gets its src once the first one is fully buffered,
        // so it is served from cache instead of downloading the file a second time
        const loadStandby = () => {
            b.src = src;
            b.load();
        };
        if (a.readyState >= 4) loadStandby();
        else a.addEventListener('canplaythrough', loadStandby, { once: true });

        b.pause();
        b.style.opacity = '0';
        a.style.opacity = '1';

        let raf;
        const tick = () => {
            const active = activeRef.current === 'a' ? a : b;
            const standby = activeRef.current === 'a' ? b : a;

            if (active.duration && !active.paused && active.currentTime >= active.duration - CROSSFADE_SECONDS) {
                if (standby.paused) {
                    standby.currentTime = 0;
                    standby.play().catch(() => {});
                }

                const remaining = active.duration - active.currentTime;
                const fadeIn = 1 - Math.max(0, Math.min(1, remaining / CROSSFADE_SECONDS));
                active.style.opacity = String(1 - fadeIn);
                standby.style.opacity = String(fadeIn);

                if (active.currentTime >= active.duration - 0.05) {
                    active.pause();
                    active.currentTime = 0;
                    activeRef.current = activeRef.current === 'a' ? 'b' : 'a';
                }
            }

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            a.removeEventListener('canplaythrough', loadStandby);
        };
    }, [src, stillOnly]);

    const videoClassName = `absolute inset-0 h-full w-full object-cover ${className}`;

    if (stillOnly) {
        return poster ? <img src={poster} alt="" className={videoClassName} style={style} /> : null;
    }

    return (
        <>
            <video
                ref={aRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                src={src}
                poster={poster}
                className={videoClassName}
                style={style}
            />
            <video
                ref={bRef}
                muted
                playsInline
                preload="none"
                className={`${videoClassName} opacity-0`}
                style={style}
            />
        </>
    );
}

export default LoopingVideo;
