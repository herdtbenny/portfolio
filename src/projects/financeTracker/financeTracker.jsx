import { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiPlus, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import ProjectHeader from '../../components/projectHeader';
import useProjectTheme from '../../components/useProjectTheme';
import {
    CATEGORIES, INCOME_CATEGORIES, DEFAULT_BUDGETS,
    monthKey, shiftMonth, formatEur, demoTransactions,
} from './financeData';

const ACCENT = '#0d9488';
// darker than the chart colors so amounts stay readable on the light theme
const INCOME = '#059669';
const EXPENSE = '#db2777';
const STORAGE_KEY = 'finance_tracker_v1';
const ALL_CATEGORIES = [...CATEGORIES, ...INCOME_CATEGORIES];

const panel = 'rounded-p border border-p-fg/[0.06] bg-p-panel p-5 shadow-p';
const label = 'm-0 mb-3 font-p-mono text-[10px] font-semibold uppercase tracking-wider text-p-subtle';
const input = 'rounded-p-sm border border-p-fg/10 bg-p-bg px-3 py-2 font-p-mono text-xs text-p-fg outline-none transition-colors focus:border-p-accent';

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
            <circle cx="70" cy="70" r={R} fill="none" style={{ stroke: 'rgb(var(--p-fg) / 0.06)' }} strokeWidth="16" />
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
            <text x="70" y="66" textAnchor="middle" fontSize="9" style={{ fill: 'rgb(var(--p-muted))', fontFamily: 'var(--p-font-mono)' }}>AUSGABEN</text>
            <text x="70" y="82" textAnchor="middle" fontSize="13" style={{ fill: 'rgb(var(--p-fg))', fontFamily: 'var(--p-font-mono)' }}>{Math.round(total)} €</text>
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
            <line x1={P} x2={W - P} y1={H - P} y2={H - P} style={{ stroke: 'rgb(var(--p-fg) / 0.1)' }} />
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
                        <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" style={{ fill: m.active ? 'rgb(var(--p-fg))' : 'rgb(var(--p-subtle))', fontFamily: 'var(--p-font-mono)' }}>
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
            <p className="m-0 font-p-mono text-xl text-p-fg sm:text-2xl" style={{ color }}>{value}</p>
            {hint && <p className="m-0 mt-1.5 font-p-mono text-[10px] uppercase tracking-wider text-p-subtle">{hint}</p>}
        </div>
    );
}

export default function FinanceTracker() {
    const themeClass = useProjectTheme('finance');
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
        <div className={`min-h-screen bg-p-bg font-p-body text-p-fg ${themeClass}`}>
            <ProjectHeader title="Finanz Tracker" subtitle="Budgets · Cashflow · Sparziel" accent={ACCENT} icon="€" />

            <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">
                {/* month switcher */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, -1))} className="flex h-9 w-9 items-center justify-center rounded-p-sm border border-p-fg/10 text-p-muted hover:text-p-fg" aria-label="Vorheriger Monat"><FiChevronLeft /></button>
                        <h1 className="m-0 min-w-[200px] text-center font-p-display text-xl font-extrabold tracking-tight sm:text-2xl">{monthLabel(month)}</h1>
                        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, 1))} className="flex h-9 w-9 items-center justify-center rounded-p-sm border border-p-fg/10 text-p-muted hover:text-p-fg" aria-label="Nächster Monat"><FiChevronRight /></button>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-p-fg/10 px-4 py-2 font-p-mono text-[11px] uppercase tracking-wider text-p-fg/80 hover:border-p-fg/25 hover:text-p-fg"><FiDownload /> CSV</button>
                        <button type="button" onClick={resetDemo} className="inline-flex items-center gap-2 rounded-full border border-p-fg/10 px-4 py-2 font-p-mono text-[11px] uppercase tracking-wider text-p-fg/80 hover:border-p-fg/25 hover:text-p-fg"><FiRotateCcw /> Demo-Daten</button>
                    </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                    <Kpi title="Einnahmen" value={formatEur(income)} color={INCOME} />
                    <Kpi title="Ausgaben" value={formatEur(expense)} color={EXPENSE} />
                    <Kpi title="Saldo" value={formatEur(balance)} color={balance >= 0 ? 'rgb(var(--p-fg))' : '#dc2626'} />
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
                                            <div className="mb-1 flex items-center justify-between font-p-mono text-[11px]">
                                                <span className="flex items-center gap-2 text-p-fg/80">
                                                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.label}
                                                </span>
                                                <span className={ratio > 1 ? 'text-red-400' : 'text-p-muted'}>
                                                    {Math.round(c.value)} /{' '}
                                                    {editingBudget === c.id ? (
                                                        <input
                                                            autoFocus
                                                            type="number"
                                                            defaultValue={budget}
                                                            onBlur={(e) => { setBudget(c.id, e.target.value); setEditingBudget(null); }}
                                                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                            className="w-16 rounded border border-p-fg/20 bg-p-bg px-1 text-p-fg outline-none"
                                                        />
                                                    ) : (
                                                        <button type="button" onClick={() => setEditingBudget(c.id)} className="underline decoration-dotted underline-offset-2 hover:text-p-fg">{budget} €</button>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-p-fg/[0.06]">
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
                                        <li key={text} className="flex gap-2.5 text-sm leading-relaxed text-p-fg/80">
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: ACCENT }} />{text}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="m-0 text-sm text-p-muted">Keine Buchungen in diesem Monat.</p>
                            )}
                        </section>
                        <section className={panel}>
                            <p className={label}>Sparziel</p>
                            <div className="mb-2 flex items-baseline justify-between gap-3">
                                <input
                                    value={goal.name}
                                    onChange={(e) => setState((s) => ({ ...s, goal: { ...s.goal, name: e.target.value } }))}
                                    className="min-w-0 flex-1 border-0 bg-transparent p-0 font-p-display text-lg font-bold text-p-fg outline-none"
                                    aria-label="Name des Sparziels"
                                />
                                <span className="font-p-mono text-xs text-p-muted">
                                    {formatEur(Math.max(0, saved))} /{' '}
                                    <input
                                        type="number"
                                        value={goal.target}
                                        onChange={(e) => setState((s) => ({ ...s, goal: { ...s.goal, target: Math.max(1, Number(e.target.value) || 1) } }))}
                                        className="w-16 border-0 bg-transparent p-0 font-p-mono text-xs text-p-fg/80 outline-none"
                                        aria-label="Zielbetrag"
                                    /> €
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-p-fg/[0.06]">
                                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, Math.max(0, saved / goal.target) * 100)}%`, background: ACCENT }} />
                            </div>
                            <p className="m-0 mt-2 font-p-mono text-[10px] uppercase tracking-wider text-p-subtle">
                                {saved >= goal.target ? 'Ziel erreicht' : `noch ${formatEur(goal.target - Math.max(0, saved))}`}
                            </p>
                        </section>
                    </div>

                    {/* history */}
                    <section className={`${panel} lg:col-span-5`}>
                        <p className={label}>Cashflow · 6 Monate</p>
                        <MonthBars months={history} />
                        <div className="mt-2 flex gap-4 font-p-mono text-[10px] uppercase tracking-wider text-p-muted">
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
                            <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-p-sm px-3 py-2 font-p-mono text-xs font-semibold text-p-ink" style={{ background: ACCENT }}>
                                <FiPlus /> Buchen
                            </button>
                        </form>

                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="m-0 font-p-mono text-[10px] font-semibold uppercase tracking-wider text-p-subtle">{visibleTx.length} Buchungen</p>
                            <input placeholder="Suchen…" value={query} onChange={(e) => setQuery(e.target.value)} className={`${input} w-40`} />
                        </div>
                        <ul className="m-0 max-h-[340px] list-none overflow-auto p-0">
                            {visibleTx.map((t) => {
                                const c = categoryById(t.category);
                                return (
                                    <li key={t.id} className="group flex items-center gap-3 border-b border-p-fg/[0.04] py-2.5">
                                        <span className="w-12 shrink-0 font-p-mono text-[11px] text-p-subtle">{t.date.slice(8)}.{t.date.slice(5, 7)}.</span>
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm text-p-fg/80">{t.description}</span>
                                            <span className="block font-p-mono text-[10px] uppercase tracking-wider text-p-subtle">{c.label}</span>
                                        </span>
                                        <span className={`font-p-mono text-sm ${t.type === 'in' ? 'text-[#059669]' : 'text-p-fg/80'}`}>
                                            {t.type === 'in' ? '+' : '−'}{formatEur(t.amount)}
                                        </span>
                                        <button type="button" onClick={() => removeTransaction(t.id)} className="text-p-subtle opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 focus:opacity-100" aria-label="Buchung löschen">
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
