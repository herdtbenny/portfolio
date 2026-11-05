import { useEffect } from 'react';

// Fonts for each project theme, loaded only when that page is opened so the
// home page doesn't pay for them.
const FONTS = {
    xg: 'family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500',
    finance: 'family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500',
    rbac: 'family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600',
    sport: 'family=Bebas+Neue&family=Archivo:wght@400;500;600;700&family=Roboto+Mono:wght@400;500',
};

function useProjectTheme(theme) {
    useEffect(() => {
        const id = `project-fonts-${theme}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${FONTS[theme]}&display=swap`;
        document.head.appendChild(link);
    }, [theme]);
    return `theme-${theme}`;
}

export default useProjectTheme;
