# Diffie-Hellman Key Exchange Simulator

A full-stack web application that demonstrates the Diffie-Hellman Key Exchange protocol - the cryptographic method that allows two parties to establish a shared secret over an insecure channel.

![Diffie-Hellman Visualization](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-ISC-blue)

## Table of Contents

- [Overview](#overview)
- [How Diffie-Hellman Works](#how-diffie-hellman-works)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Example Usage](#example-usage)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)

## Overview

The Diffie-Hellman Key Exchange is a fundamental protocol in modern cryptography. This simulator provides an interactive, visual demonstration of how two parties (conventionally called Alice and Bob) can agree on a shared secret key without ever directly transmitting it.

**Key Concepts Demonstrated:**

- Public parameter agreement (prime `p` and generator `g`)
- Private key generation (secret values `a` and `b`)
- Public key computation and exchange
- Shared secret derivation by both parties

## How Diffie-Hellman Works

### The Protocol

1. **Public Parameters**: Alice and Bob agree on two public numbers:
   - A large prime number `p`
   - A generator `g` (where 2 ≤ g < p)

2. **Private Keys**: Each party selects a secret number:
   - Alice chooses private key `a`
   - Bob chooses private key `b`

3. **Public Keys**: Each party computes their public key:
   - Alice computes: `A = g^a mod p`
   - Bob computes: `B = g^b mod p`

4. **Exchange**: Alice and Bob exchange their public keys

5. **Shared Secret**: Both parties compute the same shared secret:
   - Alice computes: `s = B^a mod p`
   - Bob computes: `s = A^b mod p`

### Why It Works

The magic lies in modular exponentiation properties:

```
s = B^a mod p
s = (g^b mod p)^a mod p
s = g^(ba) mod p
s = g^(ab) mod p
s = (g^a mod p)^b mod p
s = A^b mod p
```

Both parties arrive at the **same shared secret** without ever transmitting their private keys!

### Visual Flow

```
Alice                          Bob
  |                              |
  |-- p, g (public) ------------>|
  |<-----------------------------|
  |                              |
  |  a (private)                 |  b (private)
  |                              |
  |  A = g^a mod p               |  B = g^b mod p
  |                              |
  |-- A (public) --------------->|
  |<---- B (public) -------------|
  |                              |
  |  s = B^a mod p               |  s = A^b mod p
  |     = (g^b)^a mod p          |     = (g^a)^b mod p
  |     = g^(ab) mod p           |     = g^(ab) mod p
  |                              |
  +---------- SAME! -------------+
```

## Tech Stack

| Component    | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React 18, Vite, React-Bootstrap     |
| Backend      | Node.js, Express.js                 |
| Cryptography | BigInt-based modular exponentiation |
| Architecture | RESTful API                         |

## Features

- **Interactive Simulation**: Step-by-step visualization of the key exchange process
- **Real-time Validation**: Input validation on both frontend and backend
- **Visual Feedback**: Color-coded sections for Alice (blue) and Bob (green)
- **Educational Notes**: Inline explanations and formula displays
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Descriptive error messages for invalid inputs

## API Documentation

### Base URL

```
http://localhost:5000/api/dh
```

### Endpoints

#### 1. Health Check

```http
GET /test
```

Returns: `"server working"`

#### 2. Generate Public Keys

```http
POST /generate-public
Content-Type: application/json

{
  "p": 23,      // Prime number
  "g": 5,       // Generator (must be < p)
  "a": 6,       // Alice's private key
  "b": 15       // Bob's private key
}
```

**Response (200 OK):**

```json
{
  "A": "8",
  "B": "19",
  "info": {
    "pIsPrime": true,
    "isSafePrime": true
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Generator (g) must be less than prime (p)"
}
```

#### 3. Generate Shared Secret

```http
POST /generate-secret
Content-Type: application/json

{
  "p": 23,      // Prime number
  "a": 6,       // Private key
  "B": "19"     // Other party's public key
}
```

**Response (200 OK):**

```json
{
  "sharedSecret": "2"
}
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd diffie-hellman-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running Locally

**Development Mode** (hot-reload frontend):

```bash
# Terminal 1: Start the backend
npm start
# Server runs on http://localhost:5000

# Terminal 2: Start the Vite dev server
npm run dev
# Frontend runs on http://localhost:5173
# API requests proxy to http://localhost:5000
```

**Production Build**:

```bash
# Build the React frontend
npm run build
# Output: client/dist/

# Start backend
npm start
# Serve client/dist/ as static files (configure as needed)
```

### Development

**Backend:**

- Entry point: `server/server.js`
- API Routes: `server/routes/dhRoutes.js`
- Controllers: `server/controller/dhController.js`
- Math Utilities: `server/utils/dhMath.js`

**Frontend (React + Vite):**

- App root: `client/src/App.jsx` (state & orchestration)
- Entry: `client/src/main.jsx` (Vite bootstrap)
- Step components: `client/src/components/` (ParameterStep, PrivateKeysStep, ExchangeStep, SecretStep)
- Reusable components: `client/src/components/PartyPanel.jsx`, `OutputCard.jsx`
- Validation logic: `client/src/utils/validation.js`
- Constants: `client/src/constants.js`
- Styles: `client/src/app.css`

## Example Usage

### Test Vector

Using the classic small example for demonstration:

| Parameter | Value | Description         |
| --------- | ----- | ------------------- |
| p         | 23    | Prime number        |
| g         | 5     | Generator           |
| a         | 6     | Alice's private key |
| b         | 15    | Bob's private key   |

**Results:**

- Alice's public key (A): `5^6 mod 23 = 8`
- Bob's public key (B): `5^15 mod 23 = 19`
- Shared secret: `19^6 mod 23 = 8^15 mod 23 = 2`

### Using cURL

```bash
# Generate public keys
curl -X POST http://localhost:5000/api/dh/generate-public \
  -H "Content-Type: application/json" \
  -d '{"p":23,"g":5,"a":6,"b":15}'

# Generate shared secret
curl -X POST http://localhost:5000/api/dh/generate-secret \
  -H "Content-Type: application/json" \
  -d '{"p":23,"a":6,"B":"19"}'
```

### Using Postman

1. Create a POST request to `http://localhost:5000/api/dh/generate-public`
2. Set body type to `raw` and `JSON`
3. Enter parameters: `{"p":23,"g":5,"a":6,"b":15}`
4. Send and verify A=8, B=19
5. Create another POST request to `http://localhost:5000/api/dh/generate-secret`
6. Enter: `{"p":23,"a":6,"B":"19"}`
7. Send and verify sharedSecret=2

## Project Structure

```
diffie-hellman-simulator/
├── client/
│   ├── index.html              # Vite entry point
│   ├── src/
│   │   ├── main.jsx            # React bootstrap
│   │   ├── App.jsx             # Main app component & state
│   │   ├── app.css             # Global styles
│   │   ├── constants.js        # Shared data (primes, API URL)
│   │   ├── components/
│   │   │   ├── ParameterStep.jsx
│   │   │   ├── PrivateKeysStep.jsx
│   │   │   ├── ExchangeStep.jsx
│   │   │   ├── SecretStep.jsx
│   │   │   ├── PartyPanel.jsx
│   │   │   └── OutputCard.jsx
│   │   └── utils/
│   │       └── validation.js   # Input validation & parsing
│   ├── assets/                 # Static assets
│   └── vite.config.mjs         # Vite config with API proxy
├── server/
│   ├── server.js               # Express server entry point
│   ├── routes/
│   │   └── dhRoutes.js         # API route definitions
│   ├── controller/
│   │   └── dhController.js     # Request handlers with validation
│   └── utils/
│       └── dhMath.js           # Modular exponentiation & prime checking
├── package.json                # Project dependencies & scripts
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

## Security Notes

**This is an educational simulator and should NOT be used for actual cryptographic purposes.**

### Why This Is Not Production-Ready:

1. **No Prime Validation**: While the simulator checks if p is prime, it doesn't enforce cryptographically strong primes
2. **Small Number Support**: The simulator allows small primes for educational purposes (real DH requires 2048+ bit primes)
3. **No Side-Channel Protection**: Timing attacks are not mitigated
4. **No Entropy Source**: Private keys are user-provided, not cryptographically random
5. **Educational Focus**: Code prioritizes clarity over security

### For Real Applications:

Use established cryptographic libraries:

- **Node.js**: `crypto` module (built-in) or `tweetnacl`
- **Python**: `cryptography` library
- **Java**: `javax.crypto` (built-in)

## License

ISC

---

Built with ❤️ for educational purposes
