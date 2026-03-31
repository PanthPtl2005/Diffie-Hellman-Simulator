function modExp(base, exp, mod){
    base = BigInt(base);
    exp = BigInt(exp);
    mod = BigInt(mod);

    let result = 1n;

    while(exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

module.exports = {modExp};