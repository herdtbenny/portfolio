import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SPA navigation keeps the old scroll position by default: start new pages at
// the top, and jump to `#id` targets once the page has rendered
function ScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }
        const raf = requestAnimationFrame(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        });
        return () => cancelAnimationFrame(raf);
    }, [pathname, hash]);

    return null;
}

export default ScrollManager;
