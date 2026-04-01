// DOM Elements
const elements = {
    p: document.getElementById("p"),
    g: document.getElementById("g"),
    alicePrivate: document.getElementById("alicePrivate"),
    bobPrivate: document.getElementById("bobPrivate"),
    generateKeysBtn: document.getElementById("generateKeys"),
    generateSecretBtn: document.getElementById("generateSecret"),
    resetBtn: document.getElementById("reset"),
    alicePublic: document.getElementById("alicePublic"),
    bobPublic: document.getElementById("bobPublic"),
    secret: document.getElementById("secret"),
    exchangeSection: document.getElementById("exchangeSection"),
    secretSection: document.getElementById("secretSection"),
    aliceComputation: document.getElementById("aliceComputation"),
    bobComputation: document.getElementById("bobComputation"),
    errorDisplay: document.getElementById("errorDisplay")
};

// Safe primes for suggestions
const SAFE_PRIMES = [23, 59, 83, 107, 131, 167, 179, 223, 227, 239, 251, 263, 269, 283, 347, 359, 383, 467, 479, 503];

// API Base URL (update for production)
const API_BASE_URL = "http://localhost:5000/api/dh";

// State
let publicKeysGenerated = false;

// Validation Functions
function validateInputs() {
    const errors = [];

    const p = parseInt(elements.p.value);
    const g = parseInt(elements.g.value);
    const a = parseInt(elements.alicePrivate.value);
    const b = parseInt(elements.bobPrivate.value);

    // Check for empty values
    if (!elements.p.value.trim()) errors.push("Prime number (p) is required");
    if (!elements.g.value.trim()) errors.push("Generator (g) is required");
    if (!elements.alicePrivate.value.trim()) errors.push("Alice's private key (a) is required");
    if (!elements.bobPrivate.value.trim()) errors.push("Bob's private key (b) is required");

    // Check for valid numbers
    if (elements.p.value && isNaN(p)) errors.push("Prime (p) must be a valid number");
    if (elements.g.value && isNaN(g)) errors.push("Generator (g) must be a valid number");
    if (elements.alicePrivate.value && isNaN(a)) errors.push("Alice's private key must be a valid number");
    if (elements.bobPrivate.value && isNaN(b)) errors.push("Bob's private key must be a valid number");

    // Range validations
    if (!isNaN(p) && p < 2) errors.push("Prime (p) must be at least 2");
    if (!isNaN(g) && g < 2) errors.push("Generator (g) must be at least 2");
    if (!isNaN(a) && a < 1) errors.push("Alice's private key must be at least 1");
    if (!isNaN(b) && b < 1) errors.push("Bob's private key must be at least 1");

    // Logical validations
    if (!isNaN(p) && !isNaN(g) && g >= p) errors.push("Generator (g) must be less than prime (p)");

    // Security warnings (not blocking, just warnings)
    const warnings = [];
    if (!isNaN(p) && p < 23) {
        warnings.push(`Warning: p=${p} is a very small prime. Consider using p=23 or larger for better security demonstration.`);
    }
    if (!isNaN(p) && !SAFE_PRIMES.includes(p) && p > 1) {
        warnings.push(`Note: p=${p} may not be prime. For accurate simulation, use a prime number like: ${SAFE_PRIMES.slice(0, 5).join(", ")}...`);
    }

    return { errors, warnings, p, g, a, b };
}

function showError(message) {
    elements.errorDisplay.textContent = message;
    elements.errorDisplay.style.display = "block";
    elements.errorDisplay.style.borderColor = "var(--error-color)";
    elements.errorDisplay.style.backgroundColor = "var(--error-bg)";
    elements.errorDisplay.style.color = "var(--error-color)";
}

function showWarning(message) {
    elements.errorDisplay.textContent = message;
    elements.errorDisplay.style.display = "block";
    elements.errorDisplay.style.borderColor = "#fbbf24";
    elements.errorDisplay.style.backgroundColor = "#fef3c7";
    elements.errorDisplay.style.color = "#92400e";
}

function hideError() {
    elements.errorDisplay.style.display = "none";
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add("loading");
        button.disabled = true;
    } else {
        button.classList.remove("loading");
        button.disabled = false;
    }
}

// Event Handlers
elements.generateKeysBtn.addEventListener("click", async () => {
    hideError();

    const validation = validateInputs();

    // Show warnings but don't block
    if (validation.warnings.length > 0) {
        showWarning(validation.warnings.join(" "));
    }

    // Block on errors
    if (validation.errors.length > 0) {
        showError(validation.errors.join(". "));
        return;
    }

    const { p, g, a, b } = validation;

    setLoading(elements.generateKeysBtn, true);

    try {
        const response = await fetch(`${API_BASE_URL}/generate-public`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ p, g, a, b })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate public keys");
        }

        const data = await response.json();

        // Display results
        elements.alicePublic.textContent = data.A;
        elements.bobPublic.textContent = data.B;

        // Show exchange section with animation
        elements.exchangeSection.style.display = "block";
        elements.exchangeSection.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Enable secret generation button
        elements.generateSecretBtn.disabled = false;
        publicKeysGenerated = true;

    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        setLoading(elements.generateKeysBtn, false);
    }
});

elements.generateSecretBtn.addEventListener("click", async () => {
    hideError();

    if (!publicKeysGenerated) {
        showError("Please generate public keys first");
        return;
    }

    const validation = validateInputs();

    if (validation.errors.length > 0) {
        showError(validation.errors.join(". "));
        return;
    }

    const { p, a } = validation;
    const B = elements.bobPublic.textContent;

    setLoading(elements.generateSecretBtn, true);

    try {
        const response = await fetch(`${API_BASE_URL}/generate-secret`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ p, a, B })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to compute shared secret");
        }

        const data = await response.json();

        // Display computation results
        elements.secret.textContent = data.sharedSecret;
        elements.aliceComputation.textContent = `s = ${B}^${a} mod ${p} = ${data.sharedSecret}`;
        elements.bobComputation.textContent = `s = ${elements.alicePublic.textContent}^${validation.b} mod ${p} = ${data.sharedSecret}`;

        // Show secret section with animation
        elements.secretSection.style.display = "block";
        elements.secretSection.scrollIntoView({ behavior: "smooth", block: "nearest" });

    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        setLoading(elements.generateSecretBtn, false);
    }
});

elements.resetBtn.addEventListener("click", () => {
    // Clear all inputs
    elements.p.value = "";
    elements.g.value = "";
    elements.alicePrivate.value = "";
    elements.bobPrivate.value = "";

    // Clear outputs
    elements.alicePublic.textContent = "";
    elements.bobPublic.textContent = "";
    elements.secret.textContent = "";
    elements.aliceComputation.textContent = "";
    elements.bobComputation.textContent = "";

    // Hide sections
    elements.exchangeSection.style.display = "none";
    elements.secretSection.style.display = "none";

    // Reset state
    elements.generateSecretBtn.disabled = true;
    publicKeysGenerated = false;

    // Hide errors
    hideError();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add input event listeners for real-time validation hints
[elements.p, elements.g, elements.alicePrivate, elements.bobPrivate].forEach(input => {
    input.addEventListener("input", () => {
        hideError();
    });
});

// Initialize with example values hint
document.addEventListener("DOMContentLoaded", () => {
    console.log("Diffie-Hellman Simulator loaded. Try: p=23, g=5, a=6, b=15");
});
