// Simplified logistic expected-goals model. Coordinates are meters on a half
// pitch: x runs across (0–68), y is the distance from the goal line (0–52.5).
// The coefficients are hand-tuned to land in realistic ranges (≈0.6 from six
// yards central, ≈0.05 from 25 m), not fitted on a real event dataset.

export const PITCH = { width: 68, depth: 52.5 };
export const GOAL = { x: 34, width: 7.32 };

export const BODY_PARTS = [
    { id: 'foot', label: 'Fuß', coef: 0 },
    { id: 'head', label: 'Kopf', coef: -0.95 },
];

export const SITUATIONS = [
    { id: 'open', label: 'Aus dem Spiel', coef: 0 },
    { id: 'counter', label: 'Konter', coef: 0.35 },
    { id: 'setpiece', label: 'Standard', coef: -0.25 },
];

export const COEFFICIENTS = { intercept: -1.1, angle: 1.6, distance: -0.09 };

export function shotGeometry(x, y) {
    const dx = x - GOAL.x;
    const distance = Math.hypot(dx, y);
    // angle the goal mouth opens up from the shot position
    const half = GOAL.width / 2;
    let angle = Math.atan2(GOAL.width * y, dx * dx + y * y - half * half);
    if (angle < 0) angle += Math.PI;
    return { distance, angle };
}

export function expectedGoals({ x, y, bodyPart = 'foot', situation = 'open' }) {
    const { distance, angle } = shotGeometry(x, y);
    const body = BODY_PARTS.find((b) => b.id === bodyPart)?.coef ?? 0;
    const sit = SITUATIONS.find((s) => s.id === situation)?.coef ?? 0;
    const logit = COEFFICIENTS.intercept + COEFFICIENTS.angle * angle + COEFFICIENTS.distance * distance + body + sit;
    return 1 / (1 + Math.exp(-logit));
}

// seeded PRNG so the sample match is identical on every load
function mulberry32(seed) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// a simulated match: shot positions are drawn from a box-weighted distribution,
// goals are sampled from the model itself, so the totals stay plausible
export function sampleMatch(seed = 7) {
    const rand = mulberry32(seed);
    const shots = [];
    const make = (team, count) => {
        for (let i = 0; i < count; i++) {
            const inBox = rand() < 0.68;
            const y = inBox ? 2.5 + rand() * 14 : 17 + rand() * 13;
            const spread = inBox ? 18 : 30;
            const x = GOAL.x + (rand() - 0.5) * spread;
            const bodyPart = inBox && rand() < 0.22 ? 'head' : 'foot';
            const r = rand();
            const situation = r < 0.15 ? 'counter' : r < 0.35 ? 'setpiece' : 'open';
            const xg = expectedGoals({ x, y, bodyPart, situation });
            shots.push({
                id: `${team}-${i}`,
                team,
                x: +x.toFixed(1),
                y: +y.toFixed(1),
                bodyPart,
                situation,
                minute: 1 + Math.floor(rand() * 90),
                goal: rand() < xg,
            });
        }
    };
    make('home', 15);
    make('away', 9);
    return shots.sort((a, b) => a.minute - b.minute);
}
