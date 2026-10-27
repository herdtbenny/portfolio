export const CATEGORIES = [
    { id: 'wohnen', label: 'Wohnen', color: '#8fb0ff' },
    { id: 'essen', label: 'Lebensmittel', color: '#34d399' },
    { id: 'mobil', label: 'Mobilität', color: '#f5a524' },
    { id: 'freizeit', label: 'Freizeit', color: '#f472b6' },
    { id: 'abos', label: 'Abos & Software', color: '#a78bfa' },
    { id: 'sonstiges', label: 'Sonstiges', color: '#a3a3a3' },
];

export const INCOME_CATEGORIES = [
    { id: 'gehalt', label: 'Gehalt', color: '#34d399' },
    { id: 'freelance', label: 'Freelance', color: '#22d3ee' },
    { id: 'sonstiges_ein', label: 'Sonstiges', color: '#a3a3a3' },
];

export const DEFAULT_BUDGETS = { wohnen: 450, essen: 220, mobil: 80, freizeit: 120, abos: 40, sonstiges: 60 };

export const monthKey = (date) => date.slice(0, 7);

export function shiftMonth(key, delta) {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export const formatEur = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

// six months of fictional student finances, anchored to the current month so the demo never looks stale
export function demoTransactions(today = new Date()) {
    const current = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const tx = [];
    let n = 0;
    const add = (month, day, description, amount, category, type = 'out') => {
        tx.push({ id: `demo-${n++}`, date: `${month}-${String(day).padStart(2, '0')}`, description, amount, category, type });
    };
    for (let i = 5; i >= 0; i--) {
        const m = shiftMonth(current, -i);
        const wobble = (base, k) => Math.round((base + ((i * 37 + k * 13) % 23) - 11) * 100) / 100;
        add(m, 1, 'Werkstudenten-Gehalt', 1180, 'gehalt', 'in');
        if (i % 2 === 0) add(m, 14, 'Website-Projekt', 350 + i * 40, 'freelance', 'in');
        add(m, 2, 'Miete WG-Zimmer', 420, 'wohnen');
        add(m, 3, 'Strom & Internet', 32, 'wohnen');
        add(m, 4, 'Wocheneinkauf', wobble(58, 1), 'essen');
        add(m, 11, 'Wocheneinkauf', wobble(61, 2), 'essen');
        add(m, 18, 'Wocheneinkauf', wobble(55, 3), 'essen');
        add(m, 25, 'Wocheneinkauf', wobble(52, 4), 'essen');
        add(m, 5, 'Deutschlandticket', 58, 'mobil');
        add(m, 9, 'Bahnfahrt Köln', wobble(34, 5), 'mobil');
        add(m, 12, 'Kino & Essen', wobble(38, 6), 'freizeit');
        add(m, 21, 'Fußballtraining Beitrag', 25, 'freizeit');
        if (i % 3 === 1) add(m, 27, 'Konzertticket', 69, 'freizeit');
        add(m, 6, 'Musik-Streaming', 10.99, 'abos');
        add(m, 6, 'Cloud-Speicher', 2.99, 'abos');
        add(m, 15, 'Domain & Hosting', 12.5, 'abos');
        add(m, 20, 'Drogerie', wobble(24, 7), 'sonstiges');
    }
    return tx;
}
