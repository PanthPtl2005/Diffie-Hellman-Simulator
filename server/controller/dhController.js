const { modExp, isPrime } = require("../utils/dhMath");

// Known safe primes for validation
const SAFE_PRIMES = [23, 59, 83, 107, 131, 167, 179, 223, 227, 239, 251, 263, 269, 283, 347, 359, 383, 467, 479, 503];

const generatePublicKeys = (req, res) => {
    const { p, g, a, b } = req.body;

    // Validate presence of all parameters
    if (!p || !g || !a || !b) {
        return res.status(400).json({
            error: "Missing parameters. Required: p (prime), g (generator), a (Alice's private key), b (Bob's private key)"
        });
    }

    // Convert to numbers and validate
    const pNum = Number(p);
    const gNum = Number(g);
    const aNum = Number(a);
    const bNum = Number(b);

    // Check for valid numbers
    if (isNaN(pNum) || isNaN(gNum) || isNaN(aNum) || isNaN(bNum)) {
        return res.status(400).json({
            error: "All parameters must be valid numbers"
        });
    }

    // Check for integers
    if (!Number.isInteger(pNum) || !Number.isInteger(gNum) || !Number.isInteger(aNum) || !Number.isInteger(bNum)) {
        return res.status(400).json({
            error: "All parameters must be integers"
        });
    }

    // Validate p (prime) - must be at least 2
    if (pNum < 2) {
        return res.status(400).json({
            error: "Prime (p) must be at least 2"
        });
    }

    // Validate g (generator) - must be at least 2 and less than p
    if (gNum < 2) {
        return res.status(400).json({
            error: "Generator (g) must be at least 2"
        });
    }

    if (gNum >= pNum) {
        return res.status(400).json({
            error: "Generator (g) must be less than prime (p)"
        });
    }

    // Validate private keys - must be positive
    if (aNum < 1) {
        return res.status(400).json({
            error: "Alice's private key (a) must be at least 1"
        });
    }

    if (bNum < 1) {
        return res.status(400).json({
            error: "Bob's private key (b) must be at least 1"
        });
    }

    // Check if p is actually prime (warning level - not blocking for educational purposes)
    const pIsPrime = isPrime(pNum);
    const isSafePrime = SAFE_PRIMES.includes(pNum);

    // Generate public keys
    const A = modExp(g, a, p);
    const B = modExp(g, b, p);

    const response = {
        A: A.toString(),
        B: B.toString(),
        info: {
            pIsPrime: pIsPrime,
            isSafePrime: isSafePrime,
            note: pIsPrime ? undefined : "Warning: p is not a prime number. Results may not demonstrate proper DH properties."
        }
    };

    res.json(response);
};

const generateSharedSecret = (req, res) => {
    const { p, a, B } = req.body;

    // Validate presence of all parameters
    if (!p || !a || !B) {
        return res.status(400).json({
            error: "Missing parameters. Required: p (prime), a (private key), B (other party's public key)"
        });
    }

    // Convert to numbers
    const pNum = Number(p);
    const aNum = Number(a);

    // Check for valid numbers
    if (isNaN(pNum) || isNaN(aNum)) {
        return res.status(400).json({
            error: "p and a must be valid numbers"
        });
    }

    // Check for integers
    if (!Number.isInteger(pNum) || !Number.isInteger(aNum)) {
        return res.status(400).json({
            error: "p and a must be integers"
        });
    }

    // Validate p
    if (pNum < 2) {
        return res.status(400).json({
            error: "Prime (p) must be at least 2"
        });
    }

    // Validate private key
    if (aNum < 1) {
        return res.status(400).json({
            error: "Private key (a) must be at least 1"
        });
    }

    // Validate B (public key from other party)
    const BNum = Number(B);
    if (isNaN(BNum) || BNum < 1) {
        return res.status(400).json({
            error: "Public key (B) must be a positive number"
        });
    }

    // Compute shared secret
    const secret = modExp(B, a, p);

    res.json({
        sharedSecret: secret.toString()
    });
};

module.exports = {
    generatePublicKeys,
    generateSharedSecret
};
