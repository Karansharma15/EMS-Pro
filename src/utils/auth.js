// src/utils/auth.js
// JWT simulation + bcrypt-like hashing using Web Crypto API

const SECRET = 'ems-secret-key-2024';

/** Encode payload as a fake JWT (base64 only — no real signature for demo) */
export const createToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 }));
  const sig = btoa(SECRET + body); // simulated signature
  return `${header}.${body}.${sig}`;
};

/** Decode token and return payload */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const [, body] = token.split('.');
    const payload = JSON.parse(atob(body));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
};

/** Simple hash using djb2 (not secure — for demo only) */
export const hashPassword = (password) => {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return `hashed_${Math.abs(hash).toString(16)}_${btoa(password.slice(0, 3))}`;
};

export const verifyPassword = (plain, hashed) => {
  return hashPassword(plain) === hashed;
};
