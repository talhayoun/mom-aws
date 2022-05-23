const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const port = process.env.PORT;

require("./db/mongoose");

const userRouter = require("../src/routers/userRouter");
const mealRouter = require("../src/routers/mealsRouter");

app.use(cors());
app.use(express.json())
app.use(userRouter);
app.use(mealRouter);
app.use(express.static(path.join(__dirname, "..", "build")))

app.get("*", (req, res) => {
    console.log(path.join(__dirname, "..", "build", "index.html"))
    res.sendFile(path.join(__dirname, "..", "build", "index.html"))
})

app.listen(port, () => {
    console.log('Server connected: ', port)
})