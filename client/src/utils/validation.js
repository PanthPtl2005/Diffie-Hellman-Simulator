import { SAFE_PRIMES } from "../constants";

export function parseInteger(value) {
    if (!value.trim()) {
        return null;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function validateInputs(form) {
    const errors = [];
    const warnings = [];

    const p = parseInteger(form.p);
    const g = parseInteger(form.g);
    const a = parseInteger(form.a);
    const b = parseInteger(form.b);

    if (form.p.trim() === "") errors.push("Prime number (p) is required.");
    if (form.g.trim() === "") errors.push("Generator (g) is required.");
    if (form.a.trim() === "") errors.push("Alice's private key (a) is required.");
    if (form.b.trim() === "") errors.push("Bob's private key (b) is required.");

    if (form.p && Number.isNaN(p)) errors.push("Prime number (p) must be a whole number.");
    if (form.g && Number.isNaN(g)) errors.push("Generator (g) must be a whole number.");
    if (form.a && Number.isNaN(a)) errors.push("Alice's private key (a) must be a whole number.");
    if (form.b && Number.isNaN(b)) errors.push("Bob's private key (b) must be a whole number.");

    if (Number.isInteger(p) && p < 2) errors.push("Prime number (p) must be at least 2.");
    if (Number.isInteger(g) && g < 2) errors.push("Generator (g) must be at least 2.");
    if (Number.isInteger(a) && a < 1) errors.push("Alice's private key (a) must be at least 1.");
    if (Number.isInteger(b) && b < 1) errors.push("Bob's private key (b) must be at least 1.");
    if (Number.isInteger(p) && Number.isInteger(g) && g >= p) errors.push("Generator (g) must be less than prime (p).");

    if (Number.isInteger(p) && p > 1 && !SAFE_PRIMES.includes(p)) {
        warnings.push(`p=${p} is outside the built-in safe-prime list. The demo still works, but the example is strongest with ${SAFE_PRIMES.slice(0, 5).join(", ")}.`);
    }

    if (Number.isInteger(p) && p < 23) {
        warnings.push("Using a very small prime keeps the math readable, but it is not secure for real use.");
    }

    return { errors, warnings, p, g, a, b };
}