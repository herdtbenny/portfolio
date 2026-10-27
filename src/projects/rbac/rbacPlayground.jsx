import { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiCheck, FiLock, FiLogOut, FiSend, FiX } from 'react-icons/fi';
import ProjectHeader from '../../components/projectHeader';
import { signJwt, verifyJwt, decodePart, tamperPayload } from './jwt';

const ACCENT = '#a78bfa';
const SECRET = 'demo-secret-nur-im-browser';
const TOKEN_TTL_SECONDS = 120;

const ROLES = ['admin', 'trainer', 'spieler'];
const ROLE_LABEL = { admin: 'Admin', trainer: 'Trainer', spieler: 'Spieler' };

const USERS = [
    { id: 'u1', name: 'Alex Admin', role: 'admin' },
    { id: 'u2', name: 'Tina Trainerin', role: 'trainer' },
    { id: 'u3', name: 'Sami Spieler', role: 'spieler' },
    { id: 'u4', name: 'Lea Spielerin', role: 'spieler' },
];

const PERMISSIONS = [
    { id: 'team:read', label: 'Kader ansehen' },
    { id: 'training:read', label: 'Trainingsplan ansehen' },
    { id: 'training:write', label: 'Training anlegen' },
    { id: 'stats:read:own', label: 'Eigene Statistiken' },
    { id: 'stats:read:any', label: 'Alle Statistiken' },
    { id: 'users:manage', label: 'Nutzer verwalten' },
];

const DEFAULT_MATRIX = {
    admin: ['team:read', 'training:read', 'training:write', 'stats:read:own', 'stats:read:any', 'users:manage'],
    trainer: ['team:read', 'training:read', 'training:write', 'stats:read:own', 'stats:read:any'],
    spieler: ['team:read', 'training:read', 'stats:read:own'],
};

// each endpoint names the permission it needs; `owner` endpoints also accept the "own" variant when the id matches
const ENDPOINTS = [
    { id: 'team', method: 'GET', path: '/api/team', permission: 'team:read' },
    { id: 'trainings', method: 'POST', path: '/api/trainings', permission: 'training:write' },
    { id: 'stats-u3', method: 'GET', path: '/api/stats/u3', permission: 'stats:read:any', owner: 'u3' },
    { id: 'stats-u4', method: 'GET', path: '/api/stats/u4', permission: 'stats:read:any', owner: 'u4' },
    { id: 'delete-user', method: 'DELETE', path: '/api/users/u4', permission: 'users:manage' },
];

const panel = 'rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5';
const label = 'm-0 mb-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600';
const METHOD_COLOR = { GET: '#34d399', POST: '#8fb0ff', DELETE: '#f87171' };

// the same checks an Express/Spring middleware would run, in the same order
async function authorize(token, endpoint, matrix) {
    const trace = [];
    if (!token) {
        trace.push({ ok: false, text: 'Kein Authorization-Header' });
        return { status: 401, trace };
    }
    const result = await verifyJwt(token, SECRET);
    if (!result.valid) {
        trace.push({ ok: false, text: `JWT abgelehnt: ${result.reason}` });
        return { status: 401, trace };
    }
    trace.push({ ok: true, text: 'Signatur & Ablaufzeit gültig' });

    const { sub, role } = result.claims;
    const granted = matrix[role] || [];
    if (granted.includes(endpoint.permission)) {
        trace.push({ ok: true, text: `Rolle „${ROLE_LABEL[role]}“ hat ${endpoint.permission}` });
        return { status: 200, trace };
    }
    if (endpoint.owner && endpoint.owner === sub && granted.includes('stats:read:own')) {
        trace.push({ ok: true, text: 'Ressource gehört dem Nutzer → stats:read:own genügt' });
        return { status: 200, trace };
    }
    trace.push({ ok: false, text: `Rolle „${ROLE_LABEL[role]}“ fehlt ${endpoint.permission}` });
    return { status: 403, trace };
}

function TokenView({ token }) {
    const [h, p, s] = token.split('.');
    return (
        <p className="m-0 break-all rounded-lg bg-black p-3 font-mono text-[11px] leading-relaxed">
            <span className="text-[#f472b6]">{h}</span>.<span className="text-[#a78bfa]">{p}</span>.<span className="text-[#22d3ee]">{s}</span>
        </p>
    );
}

export default function RbacPlayground() {
    const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [tampered, setTampered] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [log, setLog] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const claims = useMemo(() => {
        try { return token ? decodePart(token.split('.')[1]) : null; } catch { return null; }
    }, [token]);
    const secondsLeft = claims ? Math.max(0, Math.round(claims.exp - now / 1000)) : 0;

    const login = async (u, ttl = TOKEN_TTL_SECONDS) => {
        const iat = Math.floor(Date.now() / 1000);
        setUser(u);
        setToken(await signJwt({ sub: u.id, name: u.name, role: u.role, iat, exp: iat + ttl }, SECRET));
        setTampered(false);
    };

    const logout = () => { setUser(null); setToken(''); setTampered(false); };

    const escalate = () => {
        setToken((t) => tamperPayload(t, { role: 'admin' }));
        setTampered(true);
    };

    const togglePermission = (role, perm) => setMatrix((m) => ({
        ...m,
        [role]: m[role].includes(perm) ? m[role].filter((p) => p !== perm) : [...m[role], perm],
    }));

    const send = async (endpoint) => {
        setBusy(true);
        const res = await authorize(token, endpoint, matrix);
        setLog((l) => [{ ...res, endpoint, at: new Date().toLocaleTimeString('de-DE'), id: Date.now() }, ...l].slice(0, 8));
        setBusy(false);
    };

    return (
        <div className="min-h-screen bg-[#000000] font-['DM_Sans',_system-ui,_sans-serif] text-white">
            <ProjectHeader title="Auth & Rollen-System" subtitle="JWT · RBAC · Middleware" accent={ACCENT} icon={<FiLock />} caseStudyId="rbac" />

            <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">
                <div className="mb-6">
                    <h1 className="m-0 font-syne text-2xl font-extrabold tracking-tight sm:text-3xl">Wer darf was – und warum?</h1>
                    <p className="m-0 mt-2 max-w-[70ch] text-sm leading-relaxed text-neutral-400">
                        Rollenbasierte Zugriffskontrolle für eine Vereins-App mit Admins, Trainern und Spielern. Melde dich als Nutzer an, schicke
                        Requests an die API und sieh Schritt für Schritt, wie die Middleware entscheidet. Die Tokens sind echte, per Web Crypto signierte HS256-JWTs.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* LOGIN + TOKEN */}
                    <section className={`${panel} lg:col-span-5`}>
                        <p className={label}>1 · Anmelden</p>
                        <div className="mb-5 grid grid-cols-2 gap-2">
                            {USERS.map((u) => (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() => login(u)}
                                    className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${user?.id === u.id ? 'border-[#a78bfa] bg-[#a78bfa]/10' : 'border-white/[0.08] hover:border-white/20'}`}
                                >
                                    <span className="block text-sm font-semibold text-white">{u.name}</span>
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">{ROLE_LABEL[u.role]} · {u.id}</span>
                                </button>
                            ))}
                        </div>

                        {token ? (
                            <>
                                <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                                    <span className="text-neutral-500">Access Token</span>
                                    <span className={secondsLeft ? 'text-neutral-400' : 'text-red-400'}>
                                        {secondsLeft ? `läuft ab in ${secondsLeft}s` : 'abgelaufen'}
                                    </span>
                                </div>
                                <TokenView token={token} />
                                <pre className="m-0 mt-3 overflow-auto rounded-lg bg-black p-3 font-mono text-[11px] leading-relaxed text-neutral-300">
                                    {JSON.stringify(claims, null, 2)}
                                </pre>
                                {tampered && (
                                    <p className="m-0 mt-3 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs leading-relaxed text-amber-300">
                                        <FiAlertTriangle className="mt-0.5 shrink-0" />
                                        Payload auf role: "admin" geändert, Signatur aber unverändert. Schick jetzt einen Request – der Server erkennt die Manipulation.
                                    </p>
                                )}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button type="button" onClick={escalate} disabled={tampered} className="rounded-full border border-amber-400/30 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-300 transition-colors hover:bg-amber-400/10 disabled:opacity-40">
                                        Rolle fälschen
                                    </button>
                                    <button type="button" onClick={() => login(user, -1)} className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white/25">
                                        Abgelaufenes Token
                                    </button>
                                    <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white/25">
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="m-0 text-sm text-neutral-500">Nicht angemeldet – Requests gehen ohne Token raus.</p>
                        )}
                    </section>

                    {/* API */}
                    <section className={`${panel} lg:col-span-7`}>
                        <p className={label}>2 · Requests senden</p>
                        <ul className="m-0 mb-5 flex list-none flex-col gap-2 p-0">
                            {ENDPOINTS.map((e) => (
                                <li key={e.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-3 py-2.5">
                                    <span className="w-14 shrink-0 font-mono text-[11px] font-semibold" style={{ color: METHOD_COLOR[e.method] }}>{e.method}</span>
                                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-neutral-200">{e.path}</span>
                                    <span className="hidden font-mono text-[10px] text-neutral-600 sm:inline">{e.permission}</span>
                                    <button type="button" disabled={busy} onClick={() => send(e)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white" aria-label={`${e.method} ${e.path} senden`}>
                                        <FiSend />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <p className={label}>Middleware-Log</p>
                        {log.length ? (
                            <ul className="m-0 flex max-h-[300px] list-none flex-col gap-2 overflow-auto p-0">
                                {log.map((entry) => (
                                    <li key={entry.id} className="animate-slideUp rounded-xl bg-black p-3">
                                        <div className="mb-1.5 flex items-center gap-3 font-mono text-[11px]">
                                            <span className={`rounded px-1.5 py-0.5 font-semibold ${entry.status === 200 ? 'bg-emerald-400/15 text-emerald-300' : entry.status === 401 ? 'bg-amber-400/15 text-amber-300' : 'bg-red-400/15 text-red-300'}`}>
                                                {entry.status}
                                            </span>
                                            <span className="text-neutral-300">{entry.endpoint.method} {entry.endpoint.path}</span>
                                            <span className="ml-auto text-neutral-600">{entry.at}</span>
                                        </div>
                                        {entry.trace.map((t, i) => (
                                            <p key={i} className={`m-0 flex items-center gap-2 font-mono text-[11px] ${t.ok ? 'text-neutral-400' : 'text-red-300'}`}>
                                                {t.ok ? <FiCheck className="text-emerald-400" /> : <FiX />} {t.text}
                                            </p>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="m-0 text-sm text-neutral-500">Noch keine Requests.</p>
                        )}
                    </section>

                    {/* MATRIX */}
                    <section className={`${panel} lg:col-span-12`}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="m-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">3 · Berechtigungsmatrix – live editierbar</p>
                            <button type="button" onClick={() => setMatrix(DEFAULT_MATRIX)} className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-white">Zurücksetzen</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse font-mono text-xs">
                                <thead>
                                    <tr>
                                        <th className="border-b border-white/[0.06] px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-neutral-600">Permission</th>
                                        {ROLES.map((r) => (
                                            <th key={r} className="border-b border-white/[0.06] px-3 py-2 text-center text-[10px] font-medium uppercase tracking-wider" style={{ color: ACCENT }}>{ROLE_LABEL[r]}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PERMISSIONS.map((p) => (
                                        <tr key={p.id}>
                                            <td className="border-b border-white/[0.04] px-3 py-2.5">
                                                <span className="text-neutral-200">{p.id}</span>
                                                <span className="ml-3 hidden text-neutral-600 sm:inline">{p.label}</span>
                                            </td>
                                            {ROLES.map((r) => {
                                                const on = matrix[r].includes(p.id);
                                                return (
                                                    <td key={r} className="border-b border-white/[0.04] px-3 py-2.5 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePermission(r, p.id)}
                                                            aria-pressed={on}
                                                            aria-label={`${p.id} für ${ROLE_LABEL[r]}`}
                                                            className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${on ? 'border-[#a78bfa] bg-[#a78bfa]/20 text-[#a78bfa]' : 'border-white/10 text-transparent hover:border-white/25'}`}
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="m-0 mt-4 max-w-[80ch] text-xs leading-relaxed text-neutral-500">
                            Die Rolle steckt signiert im Token, die Rechte pro Rolle liegen serverseitig. So lassen sich Berechtigungen ändern,
                            ohne dass Nutzer sich neu anmelden müssen – und ein manipuliertes Token fällt an der Signaturprüfung durch, bevor überhaupt eine Rolle gelesen wird.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
