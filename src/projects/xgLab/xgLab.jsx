import { useMemo, useRef, useState } from 'react';
import { FiDownload, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import ProjectHeader from '../../components/projectHeader';
import {
    PITCH, GOAL, BODY_PARTS, SITUATIONS, COEFFICIENTS,
    expectedGoals, shotGeometry, sampleMatch,
} from './xgModel';

const ACCENT = '#f5a524';
const TEAMS = {
    home: { label: 'Heim', color: '#f5a524' },
    away: { label: 'Gast', color: '#8fb0ff' },
};
const HEAT_CELL = 2;
const BIG_CHANCE = 0.25;

const label = 'm-0 mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600';
const panel = 'rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5';

function Segmented({ options, value, onChange, colorFor }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((o) => {
                const active = value === o.id;
                const color = colorFor?.(o.id) ?? ACCENT;
                return (
                    <button
                        key={o.id}
                        type="button"
                        onClick={() => onChange(o.id)}
                        className="rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors"
                        style={active ? { background: `${color}26`, color } : { color: '#737373' }}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

// exact distribution of the number of goals given independent shot probabilities (Poisson-binomial)
function goalDistribution(probs) {
    let dist = [1];
    for (const p of probs) {
        const next = new Array(dist.length + 1).fill(0);
        dist.forEach((q, k) => {
            next[k] += q * (1 - p);
            next[k + 1] += q * p;
        });
        dist = next;
    }
    return dist;
}

function outcomeProbabilities(homeProbs, awayProbs) {
    const h = goalDistribution(homeProbs);
    const a = goalDistribution(awayProbs);
    let home = 0, draw = 0, away = 0;
    h.forEach((ph, i) => a.forEach((pa, j) => {
        if (i > j) home += ph * pa;
        else if (i === j) draw += ph * pa;
        else away += ph * pa;
    }));
    return { home, draw, away };
}

function Pitch({ shots, heatmap, settings, hover, setHover, onAdd, selectedId, setSelectedId }) {
    const svgRef = useRef(null);

    const toPitch = (e) => {
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
        if (x < 0 || x > PITCH.width || y < 0.3 || y > PITCH.depth) return null;
        return { x, y };
    };

    const heatCells = useMemo(() => {
        if (!heatmap) return [];
        const cells = [];
        for (let x = 0; x < PITCH.width; x += HEAT_CELL) {
            for (let y = 0; y < PITCH.depth; y += HEAT_CELL) {
                const xg = expectedGoals({ x: x + HEAT_CELL / 2, y: y + HEAT_CELL / 2, ...settings });
                cells.push({ x, y, xg });
            }
        }
        return cells;
    }, [heatmap, settings]);

    const line = { fill: 'none', stroke: 'rgba(255,255,255,0.22)', strokeWidth: 0.25 };
    const boxW = 40.32;
    const sixW = 18.32;

    return (
        <svg
            ref={svgRef}
            viewBox={`-3 -4 ${PITCH.width + 6} ${PITCH.depth + 7}`}
            className="block w-full cursor-crosshair touch-manipulation select-none"
            onMouseMove={(e) => {
                const p = toPitch(e);
                setHover(p ? { ...p, xg: expectedGoals({ ...p, ...settings }) } : null);
            }}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
                const p = toPitch(e);
                if (p) onAdd(p);
            }}
            role="img"
            aria-label="Spielfeld: klicken, um einen Schuss zu platzieren"
        >
            <rect x={-3} y={-4} width={PITCH.width + 6} height={PITCH.depth + 7} fill="#07110c" />
            {heatCells.map((c) => (
                <rect
                    key={`${c.x}-${c.y}`}
                    x={c.x}
                    y={c.y}
                    width={HEAT_CELL}
                    height={HEAT_CELL}
                    fill={ACCENT}
                    opacity={Math.min(0.85, Math.pow(c.xg, 0.7))}
                />
            ))}

            <rect x={0} y={0} width={PITCH.width} height={PITCH.depth} {...line} />
            <rect x={GOAL.x - boxW / 2} y={0} width={boxW} height={16.5} {...line} />
            <rect x={GOAL.x - sixW / 2} y={0} width={sixW} height={5.5} {...line} />
            <rect x={GOAL.x - GOAL.width / 2} y={-2} width={GOAL.width} height={2} {...line} stroke="rgba(255,255,255,0.5)" />
            <circle cx={GOAL.x} cy={11} r={0.3} fill="rgba(255,255,255,0.4)" />
            {/* penalty arc: the part of the 9.15 m circle outside the box */}
            <path d={`M ${GOAL.x - 7.31} 16.5 A 9.15 9.15 0 0 0 ${GOAL.x + 7.31} 16.5`} {...line} />
            <path d={`M ${GOAL.x - 9.15} ${PITCH.depth} A 9.15 9.15 0 0 1 ${GOAL.x + 9.15} ${PITCH.depth}`} {...line} />

            {hover && (
                <g pointerEvents="none">
                    <line x1={hover.x} y1={hover.y} x2={GOAL.x - GOAL.width / 2} y2={0} stroke="rgba(255,255,255,0.25)" strokeWidth={0.15} />
                    <line x1={hover.x} y1={hover.y} x2={GOAL.x + GOAL.width / 2} y2={0} stroke="rgba(255,255,255,0.25)" strokeWidth={0.15} />
                    <circle cx={hover.x} cy={hover.y} r={0.6 + hover.xg * 2.4} fill="none" stroke="#fff" strokeWidth={0.2} strokeDasharray="0.6 0.4" />
                </g>
            )}

            {shots.map((s) => {
                const xg = expectedGoals(s);
                const color = TEAMS[s.team].color;
                const selected = s.id === selectedId;
                return (
                    <circle
                        key={s.id}
                        cx={s.x}
                        cy={s.y}
                        r={0.6 + xg * 2.4}
                        fill={s.goal ? color : `${color}22`}
                        stroke={selected ? '#fff' : color}
                        strokeWidth={selected ? 0.4 : 0.25}
                        className="cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setSelectedId(selected ? null : s.id); }}
                    >
                        <title>{`${s.minute}' · ${TEAMS[s.team].label} · xG ${xg.toFixed(2)}${s.goal ? ' · Tor' : ''}`}</title>
                    </circle>
                );
            })}
        </svg>
    );
}

function CumulativeChart({ shots }) {
    const W = 600, H = 180, P = 24;
    const series = Object.keys(TEAMS).map((team) => {
        let sum = 0;
        const pts = [{ m: 0, v: 0 }];
        shots.filter((s) => s.team === team).forEach((s) => {
            pts.push({ m: s.minute, v: sum });
            sum += expectedGoals(s);
            pts.push({ m: s.minute, v: sum, goal: s.goal });
        });
        pts.push({ m: 90, v: sum });
        return { team, pts, total: sum };
    });
    const maxV = Math.max(1, ...series.map((s) => s.total)) * 1.1;
    const sx = (m) => P + (m / 90) * (W - 2 * P);
    const sy = (v) => H - P - (v / maxV) * (H - 2 * P);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Kumulierter xG-Verlauf">
            {[0, 15, 30, 45, 60, 75, 90].map((m) => (
                <g key={m}>
                    <line x1={sx(m)} x2={sx(m)} y1={P} y2={H - P} stroke="rgba(255,255,255,0.05)" />
                    <text x={sx(m)} y={H - 6} textAnchor="middle" fontSize="9" fill="#525252" fontFamily="DM Mono, monospace">{m}'</text>
                </g>
            ))}
            {series.map(({ team, pts }) => (
                <g key={team}>
                    <polyline
                        points={pts.map((p) => `${sx(p.m)},${sy(p.v)}`).join(' ')}
                        fill="none"
                        stroke={TEAMS[team].color}
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    {pts.filter((p) => p.goal).map((p, i) => (
                        <circle key={i} cx={sx(p.m)} cy={sy(p.v)} r="4" fill={TEAMS[team].color} stroke="#0a0a0a" strokeWidth="2" />
                    ))}
                </g>
            ))}
        </svg>
    );
}

function downloadCsv(shots) {
    const header = 'minute,team,x,y,distance_m,angle_deg,body_part,situation,xg,goal';
    const rows = shots.map((s) => {
        const { distance, angle } = shotGeometry(s.x, s.y);
        return [s.minute, s.team, s.x, s.y, distance.toFixed(2), (angle * 180 / Math.PI).toFixed(1), s.bodyPart, s.situation, expectedGoals(s).toFixed(4), s.goal ? 1 : 0].join(',');
    });
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xg-shots.csv';
    a.click();
    URL.revokeObjectURL(url);
}

export default function XgLab() {
    const [shots, setShots] = useState(() => sampleMatch());
    const [team, setTeam] = useState('home');
    const [bodyPart, setBodyPart] = useState('foot');
    const [situation, setSituation] = useState('open');
    const [isGoal, setIsGoal] = useState(false);
    const [minute, setMinute] = useState(45);
    const [heatmap, setHeatmap] = useState(false);
    const [hover, setHover] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const settings = useMemo(() => ({ bodyPart, situation }), [bodyPart, situation]);

    const stats = useMemo(() => {
        const out = {};
        for (const t of Object.keys(TEAMS)) {
            const own = shots.filter((s) => s.team === t);
            const xgs = own.map(expectedGoals);
            const xg = xgs.reduce((a, b) => a + b, 0);
            const goals = own.filter((s) => s.goal).length;
            out[t] = {
                shots: own.length,
                goals,
                xg,
                perShot: own.length ? xg / own.length : 0,
                bigChances: xgs.filter((v) => v >= BIG_CHANCE).length,
                diff: goals - xg,
                probs: xgs,
            };
        }
        return out;
    }, [shots]);

    const outcome = useMemo(() => outcomeProbabilities(stats.home.probs, stats.away.probs), [stats]);

    const addShot = ({ x, y }) => {
        const id = `${team}-${Date.now()}`;
        setShots((prev) => [...prev, { id, team, x: +x.toFixed(1), y: +y.toFixed(1), bodyPart, situation, minute, goal: isGoal }]
            .sort((a, b) => a.minute - b.minute));
        setSelectedId(id);
        setMinute((m) => Math.min(90, m + 3));
    };

    const removeShot = (id) => setShots((prev) => prev.filter((s) => s.id !== id));

    return (
        <div className="min-h-screen bg-[#000000] font-['DM_Sans',_system-ui,_sans-serif] text-white">
            <ProjectHeader title="xG Lab" subtitle="Expected Goals · Modell & Visualisierung" accent={ACCENT} icon="◎" caseStudyId="xglab" />

            <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="m-0 font-syne text-2xl font-extrabold tracking-tight sm:text-3xl">Wie gut war die Chance wirklich?</h1>
                        <p className="m-0 mt-2 max-w-[62ch] text-sm leading-relaxed text-neutral-400">
                            Klick aufs Feld, um einen Schuss zu platzieren. Das Modell berechnet live die Torwahrscheinlichkeit aus
                            Distanz, Schusswinkel, Körperteil und Spielsituation. Geladen ist ein simuliertes Beispielspiel.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => { setShots(sampleMatch(Math.floor(Math.random() * 1e6))); setSelectedId(null); }} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white/25 hover:text-white">
                            <FiRefreshCw /> Neues Spiel
                        </button>
                        <button type="button" onClick={() => { setShots([]); setSelectedId(null); }} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white/25 hover:text-white">
                            <FiTrash2 /> Leeren
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* PITCH */}
                    <section className={`${panel} relative lg:col-span-7`}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="m-0 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                                {hover
                                    ? <>xG an dieser Position: <span className="text-white">{hover.xg.toFixed(2)}</span> · {shotGeometry(hover.x, hover.y).distance.toFixed(1)} m</>
                                    : 'Maus übers Feld bewegen'}
                            </p>
                            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                                <input type="checkbox" checked={heatmap} onChange={(e) => setHeatmap(e.target.checked)} className="accent-[#f5a524]" />
                                xG-Heatmap
                            </label>
                        </div>
                        <Pitch
                            shots={shots}
                            heatmap={heatmap}
                            settings={settings}
                            hover={hover}
                            setHover={setHover}
                            onAdd={addShot}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                        />
                        <p className="m-0 mt-3 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                            Kreisgröße = xG · gefüllt = Tor
                        </p>
                    </section>

                    {/* CONTROLS + STATS */}
                    <div className="flex flex-col gap-5 lg:col-span-5">
                        <section className={panel}>
                            <p className={label}>Nächster Schuss</p>
                            <div className="flex flex-col gap-4">
                                <Segmented options={Object.entries(TEAMS).map(([id, t]) => ({ id, label: t.label }))} value={team} onChange={setTeam} colorFor={(id) => TEAMS[id].color} />
                                <Segmented options={BODY_PARTS} value={bodyPart} onChange={setBodyPart} />
                                <Segmented options={SITUATIONS} value={situation} onChange={setSituation} />
                                <div className="flex flex-wrap items-center gap-5">
                                    <Segmented options={[{ id: false, label: 'Kein Tor' }, { id: true, label: 'Tor' }]} value={isGoal} onChange={setIsGoal} />
                                    <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                                        Minute
                                        <input
                                            type="number"
                                            min={1}
                                            max={90}
                                            value={minute}
                                            onChange={(e) => setMinute(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
                                            className="w-16 rounded-lg border border-white/10 bg-black px-2 py-1.5 text-white outline-none focus:border-[#f5a524]"
                                        />
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className={panel}>
                            <div className="mb-4 grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2.5 font-mono text-xs">
                                <span />
                                {Object.entries(TEAMS).map(([id, t]) => (
                                    <span key={id} className="text-right text-[10px] uppercase tracking-wider" style={{ color: t.color }}>{t.label}</span>
                                ))}
                                {[
                                    ['Tore', (s) => s.goals],
                                    ['xG', (s) => s.xg.toFixed(2)],
                                    ['Schüsse', (s) => s.shots],
                                    ['xG / Schuss', (s) => s.perShot.toFixed(2)],
                                    [`Großchancen (≥ ${BIG_CHANCE})`, (s) => s.bigChances],
                                    ['Tore − xG', (s) => `${s.diff >= 0 ? '+' : ''}${s.diff.toFixed(2)}`],
                                ].map(([name, fn]) => (
                                    <div key={name} className="contents">
                                        <span className="text-neutral-500">{name}</span>
                                        <span className="text-right text-white">{fn(stats.home)}</span>
                                        <span className="text-right text-white">{fn(stats.away)}</span>
                                    </div>
                                ))}
                            </div>

                            <p className={label}>Verdientes Ergebnis laut xG</p>
                            <div className="flex h-2.5 overflow-hidden rounded-full">
                                <div style={{ width: `${outcome.home * 100}%`, background: TEAMS.home.color }} />
                                <div style={{ width: `${outcome.draw * 100}%`, background: '#404040' }} />
                                <div style={{ width: `${outcome.away * 100}%`, background: TEAMS.away.color }} />
                            </div>
                            <div className="mt-2 flex justify-between font-mono text-[11px] text-neutral-400">
                                <span>Heimsieg {(outcome.home * 100).toFixed(0)} %</span>
                                <span>Remis {(outcome.draw * 100).toFixed(0)} %</span>
                                <span>Auswärts {(outcome.away * 100).toFixed(0)} %</span>
                            </div>
                        </section>
                    </div>

                    {/* TIMELINE */}
                    <section className={`${panel} lg:col-span-7`}>
                        <p className={label}>Kumulierter xG-Verlauf</p>
                        <CumulativeChart shots={shots} />
                    </section>

                    {/* MODEL */}
                    <section className={`${panel} lg:col-span-5`}>
                        <p className={label}>Das Modell</p>
                        <code className="block rounded-lg bg-black px-3 py-3 font-mono text-[11px] leading-relaxed text-neutral-300">
                            xG = 1 / (1 + e<sup>−z</sup>)<br />
                            z = {COEFFICIENTS.intercept} + {COEFFICIENTS.angle}·Winkel {COEFFICIENTS.distance}·Distanz + β<sub>Körper</sub> + β<sub>Situation</sub>
                        </code>
                        <p className="m-0 mt-3 text-xs leading-relaxed text-neutral-500">
                            Logistische Regression auf zwei geometrischen Features, wie sie auch in professionellen xG-Modellen die stärksten
                            Prädiktoren sind. Die Koeffizienten sind von Hand kalibriert, nicht auf echten Eventdaten trainiert. Die Ergebnis-Wahrscheinlichkeit
                            wird exakt über die Poisson-Binomial-Verteilung der Tore berechnet, ohne Monte-Carlo.
                        </p>
                    </section>

                    {/* SHOT TABLE */}
                    <section className={`${panel} lg:col-span-12`}>
                        <div className="mb-3 flex items-center justify-between">
                            <p className="m-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">{shots.length} Schüsse</p>
                            <button type="button" onClick={() => downloadCsv(shots)} disabled={!shots.length} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400 transition-colors hover:text-white disabled:opacity-40">
                                <FiDownload /> CSV
                            </button>
                        </div>
                        <div className="max-h-[320px] overflow-auto">
                            <table className="w-full border-collapse text-left font-mono text-xs">
                                <thead className="sticky top-0 bg-[#0a0a0a]">
                                    <tr className="text-[10px] uppercase tracking-wider text-neutral-600">
                                        {['Min', 'Team', 'Situation', 'Körper', 'Distanz', 'xG', 'Ergebnis', ''].map((h) => (
                                            <th key={h} className="border-b border-white/[0.06] px-2 py-2 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {shots.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
                                            className={`cursor-pointer transition-colors hover:bg-white/[0.03] ${s.id === selectedId ? 'bg-white/[0.05]' : ''}`}
                                        >
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-neutral-500">{s.minute}'</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2" style={{ color: TEAMS[s.team].color }}>{TEAMS[s.team].label}</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-neutral-400">{SITUATIONS.find((x) => x.id === s.situation).label}</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-neutral-400">{BODY_PARTS.find((x) => x.id === s.bodyPart).label}</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-neutral-400">{shotGeometry(s.x, s.y).distance.toFixed(1)} m</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-white">{expectedGoals(s).toFixed(2)}</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2">{s.goal ? <span style={{ color: TEAMS[s.team].color }}>Tor</span> : <span className="text-neutral-600">–</span>}</td>
                                            <td className="border-b border-white/[0.04] px-2 py-2 text-right">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeShot(s.id); }} className="text-neutral-600 transition-colors hover:text-red-400" aria-label="Schuss entfernen">
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
