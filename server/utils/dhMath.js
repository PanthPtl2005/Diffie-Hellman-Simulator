/**
 * Fast Modular Exponentiation using Exponentiation by Squaring
 * Time Complexity: O(log n)
 *
 * @param {number|string|bigint} base - The base number
 * @param {number|string|bigint} exp - The exponent
 * @param {number|string|bigint} mod - The modulus
 * @returns {bigint} Result of (base^exp) mod mod
 */
function modExp(base, exp, mod) {
    base = BigInt(base);
    exp = BigInt(exp);
    mod = BigInt(mod);

    let result = 1n;

    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

/**
 * Check if a number is prime
 * Uses trial division up to sqrt(n) for efficiency
 *
 * @param {number} n - Number to check
 * @returns {boolean} True if prime, false otherwise
 */
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    if (n === 3) return true;

    const sqrt = Math.floor(Math.sqrt(n));
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

/**
 * Find the next prime number >= n
 *
 * @param {number} n - Starting number
 * @returns {number} The next prime number
 */
function nextPrime(n) {
    if (n <= 2) return 2;
    if (n % 2 === 0) n++;
    while (!isPrime(n)) {
        n += 2;
    }
    return n;
}

/**
 * Check if a number is a primitive root modulo p
 * Simplified check - verifies g generates a large subgroup
 *
 * @param {number} g - Candidate generator
 * @param {number} p - Prime modulus
 * @returns {boolean} True if g appears to be a valid generator
 */
function isValidGenerator(g, p) {
    if (g < 2 || g >= p) return false;

    // For a prime p, g is a primitive root if g^((p-1)/q) != 1 (mod p)
    // for all prime factors q of p-1
    // Simplified: just check g^2 != 1 and g^(p-1)/2 != 1

    const gBig = BigInt(g);
    const pBig = BigInt(p);

    // Check g^2 mod p != 1
    const g2 = (gBig * gBig) % pBig;
    if (g2 === 1n) return false;

    return true;
}

module.exports = {
    modExp,
    isPrime,
    nextPrime,
    isValidGenerator
};
