const express = require("express");
const router = express.Router();

const {
    generatePublicKeys,
    generateSharedSecret
} = require("../controller/dhController");

router.post("/generate-public", generatePublicKeys);
router.post("/generate-secret", generateSharedSecret);

module.exports = router;