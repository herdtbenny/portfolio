import { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiPlus, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import ProjectHeader from '../../components/projectHeader';
import {
    CATEGORIES, INCOME_CATEGORIES, DEFAULT_BUDGETS,
    monthKey, shiftMonth, formatEur, demoTransactions,
} from './financeData';

const ACCENT = '#22d3ee';
const STORAGE_KEY = 'finance_tracker_v1';
const ALL_CATEGORIES = [...CATEGORIES, ...INCOME_CATEGORIES];

const panel = 'rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5';
const label = 'm-0 mb-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600';
const input = 'rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white outline-none transition-colors focus:border-[#22d3ee]';

const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const categoryById = (id) => ALL_CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
const monthLabel = (key) => {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
};

function initialState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved?.transactions) return saved;
    } catch { /* storage blocked or corrupt: fall back to demo data */ }
    return { transactions: demoTransactions(), budgets: DEFAULT_BUDGETS, goal: { name: 'Neuer Laptop', target: 4500 } };
}

function sumBy(list, type) {
    return list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
}

function Donut({ slices, total }) {
    const R = 52, C = 2 * Math.PI * R;
    let offset = 0;
    return (
        <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" role="img" aria-label="Ausgaben nach Kategorie">
            <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
            {slices.map((s) => {
                const len = total ? (s.value / total) * C : 0;
                const el = (
                    <circle
                        key={s.id}
                        cx="70"
                        cy="70"
                        r={R}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="16"
                        strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 70 70)"
                    />
                );
                offset += len;
                return el;
            })}
            <text x="70" y="66" textAnchor="middle" fontSize="9" fill="#737373" fontFamily="DM Mono, monospace">AUSGABEN</text>
            <text x="70" y="82" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="DM Mono, monospace">{Math.round(total)} €</text>
        </svg>
    );
}

function MonthBars({ months }) {
    const W = 520, H = 170, P = 22;
    const max = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));
    const slot = (W - 2 * P) / months.length;
    const bw = Math.min(18, slot / 3);
    const sy = (v) => (v / max) * (H - 2 * P);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Einnahmen und Ausgaben der letzten sechs Monate">
            <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="rgba(255,255,255,0.08)" />
            {months.map((m, i) => {
                const cx = P + slot * i + slot / 2;
                return (
                    <g key={m.key}>
                        <rect x={cx - bw - 2} y={H - P - sy(m.income)} width={bw} height={sy(m.income)} rx="3" fill="#34d399" opacity={m.active ? 1 : 0.45}>
                            <title>{`Einnahmen ${formatEur(m.income)}`}</title>
                        </rect>
                        <rect x={cx + 2} y={H - P - sy(m.expense)} width={bw} height={sy(m.expense)} rx="3" fill="#f472b6" opacity={m.active ? 1 : 0.45}>
                            <title>{`Ausgaben ${formatEur(m.expense)}`}</title>
                        </rect>
                        <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill={m.active ? '#fff' : '#525252'} fontFamily="DM Mono, monospace">
                            {monthLabel(m.key).slice(0, 3)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function Kpi({ title, value, hint, color = '#fff' }) {
    return (
        <div className={panel}>
            <p className={label}>{title}</p>
            <p className="m-0 font-mono text-xl text-white sm:text-2xl" style={{ color }}>{value}</p>
            {hint && <p className="m-0 mt-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600">{hint}</p>}
        </div>
    );
}

export default function FinanceTracker() {
    const [state, setState] = useState(initialState);
    const [month, setMonth] = useState(() => monthKey(todayKey()));
    const [query, setQuery] = useState('');
    const [editingBudget, setEditingBudget] = useState(null);
    const [form, setForm] = useState({ date: todayKey(), description: '', amount: '', category: 'essen', type: 'out' });

    const { transactions, budgets, goal } = state;

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    }, [state]);

    const monthTx = useMemo(
        () => transactions.filter((t) => monthKey(t.date) === month).sort((a, b) => b.date.localeCompare(a.date)),
        [transactions, month]
    );
    const income = sumBy(monthTx, 'in');
    const expense = sumBy(monthTx, 'out');
    const balance = income - expense;
    const savingsRate = income ? balance / income : 0;

    const byCategory = useMemo(() => CATEGORIES.map((c) => ({
        ...c,
        value: monthTx.filter((t) => t.type === 'out' && t.category === c.id).reduce((s, t) => s + t.amount, 0),
    })), [monthTx]);

    const history = useMemo(() => Array.from({ length: 6 }, (_, i) => {
        const key = shiftMonth(month, i - 5);
        const list = transactions.filter((t) => monthKey(t.date) === key);
        return { key, income: sumBy(list, 'in'), expense: sumBy(list, 'out'), active: key === month };
    }), [transactions, month]);

    // everything saved up to and including the selected month counts towards the goal
    const saved = useMemo(() => transactions
        .filter((t) => monthKey(t.date) <= month)
        .reduce((s, t) => s + (t.type === 'in' ? t.amount : -t.amount), 0), [transactions, month]);

    const insights = useMemo(() => {
        const out = [];
        const top = [...byCategory].sort((a, b) => b.value - a.value)[0];
        if (top?.value) out.push(`Größter Posten: ${top.label} mit ${Math.round((top.value / expense) * 100)} % der Ausgaben.`);
        const over = byCategory.filter((c) => budgets[c.id] && c.value > budgets[c.id]);
        if (over.length) out.push(`Budget überschritten: ${over.map((c) => c.label).join(', ')}.`);
        else if (expense) out.push('Alle Budgets eingehalten.');
        const prev = history[history.length - 2];
        if (prev?.expense && expense) {
            const delta = (expense - prev.expense) / prev.expense;
            out.push(`Ausgaben ${delta >= 0 ? '+' : ''}${(delta * 100).toFixed(0)} % gegenüber Vormonat.`);
        }
        const now = new Date();
        if (month === monthKey(todayKey()) && expense) {
            const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            out.push(`Prognose Monatsende bei aktuellem Tempo: ${formatEur((expense / now.getDate()) * days)} Ausgaben.`);
        }
        return out;
    }, [byCategory, budgets, expense, history, month]);

    const visibleTx = monthTx.filter((t) => t.description.toLowerCase().includes(query.toLowerCase()));

    const addTransaction = (e) => {
        e.preventDefault();
        const amount = Math.abs(parseFloat(String(form.amount).replace(',', '.')));
        if (!form.description.trim() || !amount) return;
        setState((s) => ({ ...s, transactions: [...s.transactions, { ...form, amount, id: `tx-${Date.now()}` }] }));
        setForm((f) => ({ ...f, description: '', amount: '' }));
        setMonth(monthKey(form.date));
    };

    const removeTransaction = (id) => setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
    const setBudget = (id, value) => setState((s) => ({ ...s, budgets: { ...s.budgets, [id]: Math.max(0, Number(value) || 0) } }));
    const resetDemo = () => setState({ transactions: demoTransactions(), budgets: DEFAULT_BUDGETS, goal: { name: 'Neuer Laptop', target: 4500 } });

    const exportCsv = () => {
        const rows = transactions.map((t) => [t.date, `"${t.description.replace(/"/g, '""')}"`, t.type, categoryById(t.category).label, t.amount.toFixed(2)].join(';'));
        const blob = new Blob([['Datum;Beschreibung;Typ;Kategorie;Betrag', ...rows].join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finanzen.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const formCategories = form.type === 'in' ? INCOME_CATEGORIES : CATEGORIES;

    return (
        <div className="min-h-screen bg-[#000000] font-['DM_Sans',_system-ui,_sans-serif] text-white">
            <ProjectHeader title="Finanz Tracker" subtitle="Budgets · Cashflow · Sparziel" accent={ACCENT} icon="€" caseStudyId="finanztracker" />

            <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">
                {/* month switcher */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, -1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:text-white" aria-label="Vorheriger Monat"><FiChevronLeft /></button>
                        <h1 className="m-0 min-w-[200px] text-center font-syne text-xl font-extrabold tracking-tight sm:text-2xl">{monthLabel(month)}</h1>
                        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:text-white" aria-label="Nächster Monat"><FiChevronRight /></button>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 hover:border-white/25 hover:text-white"><FiDownload /> CSV</button>
                        <button type="button" onClick={resetDemo} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 hover:border-white/25 hover:text-white"><FiRotateCcw /> Demo-Daten</button>
                    </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                    <Kpi title="Einnahmen" value={formatEur(income)} color="#34d399" />
                    <Kpi title="Ausgaben" value={formatEur(expense)} color="#f472b6" />
                    <Kpi title="Saldo" value={formatEur(balance)} color={balance >= 0 ? '#fff' : '#f87171'} />
                    <Kpi title="Sparquote" value={`${(savingsRate * 100).toFixed(0)} %`} hint={savingsRate >= 0.2 ? 'über der 20-%-Faustregel' : 'unter der 20-%-Faustregel'} color={ACCENT} />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* categories + budgets */}
                    <section className={`${panel} lg:col-span-7`}>
                        <p className={label}>Budgets · Klick auf den Betrag zum Anpassen</p>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <Donut slices={byCategory} total={expense} />
                            <ul className="m-0 flex flex-1 list-none flex-col gap-3 p-0">
                                {byCategory.map((c) => {
                                    const budget = budgets[c.id] || 0;
                                    const ratio = budget ? c.value / budget : 0;
                                    return (
                                        <li key={c.id}>
                                            <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
                                                <span className="flex items-center gap-2 text-neutral-300">
                                                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.label}
                                                </span>
                                                <span className={ratio > 1 ? 'text-red-400' : 'text-neutral-500'}>
                                                    {Math.round(c.value)} /{' '}
                                                    {editingBudget === c.id ? (
                                                        <input
                                                            autoFocus
                                                            type="number"
                                                            defaultValue={budget}
                                                            onBlur={(e) => { setBudget(c.id, e.target.value); setEditingBudget(null); }}
                                                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                            className="w-16 rounded border border-white/20 bg-black px-1 text-white outline-none"
                                                        />
                                                    ) : (
                                                        <button type="button" onClick={() => setEditingBudget(c.id)} className="underline decoration-dotted underline-offset-2 hover:text-white">{budget} €</button>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                    className="h-full rounded-full transition-[width] duration-500"
                                                    style={{ width: `${Math.min(100, ratio * 100)}%`, background: ratio > 1 ? '#f87171' : c.color }}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>

                    {/* insights + goal */}
                    <div className="flex flex-col gap-5 lg:col-span-5">
                        <section className={panel}>
                            <p className={label}>Auswertung</p>
                            {insights.length ? (
                                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                                    {insights.map((text) => (
                                        <li key={text} className="flex gap-2.5 text-sm leading-relaxed text-neutral-300">
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: ACCENT }} />{text}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="m-0 text-sm text-neutral-500">Keine Buchungen in diesem Monat.</p>
                            )}
                        </section>
                        <section className={panel}>
                            <p className={label}>Sparziel</p>
                            <div className="mb-2 flex items-baseline justify-between gap-3">
                                <input
                                    value={goal.name}
                                    onChange={(e) => setState((s) => ({ ...s, goal: { ...s.goal, name: e.target.value } }))}
                                    className="min-w-0 flex-1 border-0 bg-transparent p-0 font-syne text-lg font-bold text-white outline-none"
                                    aria-label="Name des Sparziels"
                                />
                                <span className="font-mono text-xs text-neutral-500">
                                    {formatEur(Math.max(0, saved))} /{' '}
                                    <input
                                        type="number"
                                        value={goal.target}
                                        onChange={(e) => setState((s) => ({ ...s, goal: { ...s.goal, target: Math.max(1, Number(e.target.value) || 1) } }))}
                                        className="w-16 border-0 bg-transparent p-0 font-mono text-xs text-neutral-300 outline-none"
                                        aria-label="Zielbetrag"
                                    /> €
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, Math.max(0, saved / goal.target) * 100)}%`, background: ACCENT }} />
                            </div>
                            <p className="m-0 mt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                                {saved >= goal.target ? 'Ziel erreicht' : `noch ${formatEur(goal.target - Math.max(0, saved))}`}
                            </p>
                        </section>
                    </div>

                    {/* history */}
                    <section className={`${panel} lg:col-span-5`}>
                        <p className={label}>Cashflow · 6 Monate</p>
                        <MonthBars months={history} />
                        <div className="mt-2 flex gap-4 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#34d399]" />Einnahmen</span>
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#f472b6]" />Ausgaben</span>
                        </div>
                    </section>

                    {/* transactions */}
                    <section className={`${panel} lg:col-span-7`}>
                        <form onSubmit={addTransaction} className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-[auto_1fr_90px_auto]">
                            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, category: e.target.value === 'in' ? 'gehalt' : 'essen' }))} className={input}>
                                <option value="out">Ausgabe</option>
                                <option value="in">Einnahme</option>
                            </select>
                            <input placeholder="Beschreibung" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={input} />
                            <input placeholder="Betrag" inputMode="decimal" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className={input} />
                            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={input}>
                                {formCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={input} />
                            <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs font-semibold text-black" style={{ background: ACCENT }}>
                                <FiPlus /> Buchen
                            </button>
                        </form>

                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="m-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">{visibleTx.length} Buchungen</p>
                            <input placeholder="Suchen…" value={query} onChange={(e) => setQuery(e.target.value)} className={`${input} w-40`} />
                        </div>
                        <ul className="m-0 max-h-[340px] list-none overflow-auto p-0">
                            {visibleTx.map((t) => {
                                const c = categoryById(t.category);
                                return (
                                    <li key={t.id} className="group flex items-center gap-3 border-b border-white/[0.04] py-2.5">
                                        <span className="w-12 shrink-0 font-mono text-[11px] text-neutral-600">{t.date.slice(8)}.{t.date.slice(5, 7)}.</span>
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm text-neutral-200">{t.description}</span>
                                            <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-600">{c.label}</span>
                                        </span>
                                        <span className={`font-mono text-sm ${t.type === 'in' ? 'text-[#34d399]' : 'text-neutral-300'}`}>
                                            {t.type === 'in' ? '+' : '−'}{formatEur(t.amount)}
                                        </span>
                                        <button type="button" onClick={() => removeTransaction(t.id)} className="text-neutral-700 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 focus:opacity-100" aria-label="Buchung löschen">
                                            <FiTrash2 />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
