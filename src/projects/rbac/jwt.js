// Minimal HS256 JWT implementation on top of the Web Crypto API. Runs fully in
// the browser for the demo; in production the secret never leaves the server.

const encoder = new TextEncoder();

const toBase64Url = (bytes) =>
    btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const encodeJson = (obj) => toBase64Url(encoder.encode(JSON.stringify(obj)));

export function decodePart(part) {
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
        atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
            .split('')
            .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
            .join('')
    );
    return JSON.parse(json);
}

const importKey = (secret) =>
    crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

export async function signJwt(payload, secret) {
    const unsigned = `${encodeJson({ alg: 'HS256', typ: 'JWT' })}.${encodeJson(payload)}`;
    const signature = await crypto.subtle.sign('HMAC', await importKey(secret), encoder.encode(unsigned));
    return `${unsigned}.${toBase64Url(signature)}`;
}

export async function verifyJwt(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, reason: 'Token hat nicht drei Teile' };
    const [header, payload, signature] = parts;
    try {
        const sig = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (signature.length % 4)) % 4)), (c) => c.charCodeAt(0));
        const ok = await crypto.subtle.verify('HMAC', await importKey(secret), sig, encoder.encode(`${header}.${payload}`));
        if (!ok) return { valid: false, reason: 'Signatur ungültig' };
        const claims = decodePart(payload);
        if (claims.exp && claims.exp * 1000 < Date.now()) return { valid: false, reason: 'Token abgelaufen', claims };
        return { valid: true, claims };
    } catch {
        return { valid: false, reason: 'Token nicht lesbar' };
    }
}

// rewrites the payload but keeps the old signature, exactly what an attacker would try
export function tamperPayload(token, changes) {
    const [header, payload, signature] = token.split('.');
    return `${header}.${encodeJson({ ...decodePart(payload), ...changes })}.${signature}`;
}
