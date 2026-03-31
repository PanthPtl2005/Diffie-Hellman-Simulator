const {modExp} = require("../utils/dhMath");

const generatePublicKeys = (req, res) => {
    const {p, g, a, b} = req.body;

    const A = modExp(g,a,p);
    const B = modExp(g,b,p);

    res.json({
        A: A.toString(),
        B: B.toString()
    });
};

const generateSharedSecret = (req, res) => {
    const {p, a, B} = req.body;

    const secret = modExp(B, a, p);

    res.json({
        sharedSecret: secret.toString()
    });
};

module.exports = {
    generatePublicKeys,
    generateSharedSecret
};