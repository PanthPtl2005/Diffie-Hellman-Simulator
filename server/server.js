const express = require("express");
const cors = require("cors");

const app = express();

//routes
const dhRoutes = require("./routes/dhRoutes");

app.use(cors());
app.use(express.json());

//testRoutes
app.get("/test", (req, res) => {
    res.send("server working");
});

//dhRoutes
app.use("/api/dh", dhRoutes);

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`); 
});
