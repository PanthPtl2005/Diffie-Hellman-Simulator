const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("server working");
});

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`); 
});
