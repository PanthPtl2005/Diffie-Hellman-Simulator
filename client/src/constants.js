export const SAFE_PRIMES = [23, 59, 83, 107, 131, 167, 179, 223, 227, 239, 251, 263, 269, 283, 347, 359, 383, 467, 479, 503];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/dh";

export const INITIAL_FORM = {
    p: "23",
    g: "5",
    a: "6",
    b: "15"
};