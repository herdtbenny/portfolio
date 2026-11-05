import React from 'react';

export function Tabelle({ data }) {
    if (!data?.length) return <p className="px-4 py-10 text-center font-p-mono text-sm text-p-muted">Keine Tabellendaten verfügbar.</p>;
    const total = data.length;
    return (
        <div className="animate-slideUp overflow-hidden rounded-p border border-p-fg/[0.06]">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr>
                    {['#', 'Verein', 'Sp', 'S', 'U', 'N', 'Tore', 'Pkt'].map(h => (
                        <th
                            key={h}
                            className={`whitespace-nowrap border-b border-p-fg/[0.06] bg-p-panel px-3 py-2.5 font-p-mono text-[10px] font-medium uppercase tracking-wider text-p-accent ${h === 'Verein' ? 'text-left' : 'text-center'}`}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((team, i) => {
                    const isQualification = i < 4;
                    const isRelegation    = i >= total - 3;
                    const zoneAccent = isQualification ? 'border-l-p-accent' : isRelegation ? 'border-l-red-400/70' : 'border-l-transparent';
                    return (
                        <tr key={team.teamInfoId ?? i} className={`group border-l-2 transition-colors ${zoneAccent} ${i % 2 === 0 ? 'bg-transparent' : 'bg-p-accent/[0.02]'}`}>
                            <td className="border-b border-p-fg/[0.04] px-3 py-2.5 text-center font-p-mono text-[11px] text-p-muted group-hover:bg-p-accent/5">{i + 1}</td>
                            <td className="flex items-center gap-2.5 border-b border-p-fg/[0.04] px-3 py-2.5 text-p-fg group-hover:bg-p-accent/5">
                                <img src={team.teamIconUrl} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" onError={e => e.target.style.display = 'none'} />
                                {team.teamName}
                            </td>
                            {[team.matches, team.won, team.draw, team.lost].map((v, j) => (
                                <td key={j} className="border-b border-p-fg/[0.04] px-3 py-2.5 text-center font-p-mono text-p-muted group-hover:bg-p-accent/5">{v}</td>
                            ))}
                            <td className="border-b border-p-fg/[0.04] px-3 py-2.5 text-center font-p-mono text-p-muted group-hover:bg-p-accent/5">{team.goals}:{team.opponentGoals}</td>
                            <td className="border-b border-p-fg/[0.04] px-3 py-2.5 text-center group-hover:bg-p-accent/5">
                                <strong className="font-p-mono font-medium text-p-accent">{team.points}</strong>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div className="flex flex-wrap items-center gap-4 border-t border-p-fg/[0.06] bg-p-panel/60 px-3 py-2.5 font-p-mono text-[10px] uppercase tracking-wider text-p-muted">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-p-accent" />International</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400/70" />Abstieg</span>
            </div>
        </div>
    );
}

export function Spiele({ data }) {
    const matches = (Array.isArray(data) ? data : [data]).filter(m => m?.team1);
    if (!matches.length) return <p className="px-4 py-10 text-center font-p-mono text-sm text-p-muted">Keine Spiele gefunden.</p>;
    return (
        <div className="flex animate-slideUp flex-col gap-2">
            {matches.map((m, i) => {
                const res   = m.matchResults?.find(r => r.resultTypeID === 2) ?? m.matchResults?.at(-1);
                const score = res ? `${res.pointsTeam1} : ${res.pointsTeam2}` : '– : –';
                const date  = new Date(m.matchDateTimeUTC).toLocaleDateString('de-DE', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                });
                return (
                    <div key={m.matchID ?? i} className="rounded-p-sm border border-p-fg/[0.06] bg-p-panel p-4 transition-colors hover:border-p-accent/60 hover:bg-p-fg/[0.04] sm:p-[18px]">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center text-xs font-medium text-p-fg/80">
                                <img src={m.team1.teamIconUrl} alt="" className="h-7 w-7 object-contain" onError={e => e.target.style.display = 'none'} />
                                <span className="w-full truncate">{m.team1.teamName}</span>
                            </div>
                            <div className="shrink-0 text-center">
                                <div className="min-w-16 font-p-mono text-xl font-medium tracking-wide text-p-fg sm:text-2xl">{m.matchIsFinished ? score : '– : –'}</div>
                                <span className={`mt-1 inline-block rounded-full px-2.5 py-1 font-p-mono text-[10px] font-semibold tracking-wide ${m.matchIsFinished ? 'bg-p-fg/[0.06] text-p-muted' : 'bg-p-accent/10 text-p-accent'}`}>
                                    {m.matchIsFinished ? 'Beendet' : 'Geplant'}
                                </span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center text-xs font-medium text-p-fg/80">
                                <img src={m.team2?.teamIconUrl} alt="" className="h-7 w-7 object-contain" onError={e => e.target.style.display = 'none'} />
                                <span className="w-full truncate">{m.team2?.teamName}</span>
                            </div>
                        </div>
                        <div className="mt-2.5 text-center font-p-mono text-[11px] text-p-muted">{date}{m.group?.groupName ? ` · ${m.group.groupName}` : ''}</div>
                    </div>
                );
            })}
        </div>
    );
}

export function Torjaeger({ data }) {
    if (!data?.length) return <p className="px-4 py-10 text-center font-p-mono text-sm text-p-muted">Keine Torjäger-Daten verfügbar.</p>;
    const sorted = [...data].sort((a, b) => b.goalCount - a.goalCount).slice(0, 20);
    return (
        <div className="flex animate-slideUp flex-col">
            {sorted.map((g, i) => (
                <div key={i} className="flex items-center gap-3.5 border-b border-p-fg/[0.04] px-2 py-3 transition-colors last:border-b-0 hover:bg-p-accent/5">
                    <span className="w-6 shrink-0 text-center font-p-mono text-[11px] font-semibold text-p-muted">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-p-fg">{g.goalGetterName}</div>
                        {g.teamName && <div className="truncate text-[11px] text-p-muted">{g.teamName}</div>}
                    </div>
                    <span className="w-10 shrink-0 text-right font-p-mono text-lg font-semibold text-p-accent">{g.goalCount}</span>
                </div>
            ))}
        </div>
    );
}
