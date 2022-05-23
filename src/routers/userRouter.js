const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/userModel");


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(404).json({ error: 'שם משתמש או סיסמה שגויים' });

        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "שם משתמש לא קיים במערכת" });

        let isPassMatch = await bcrypt.compare(password, user.password);

        if (!isPassMatch) return res.status(400).json({ error: 'שם משתמש או סיסמה שגויים' });

        const token = await user.generateAuthToken();

        res.json({ token });

    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/signup", async (req, res) => {
    try {
        const user = await new User({ username: req.body.username, password: req.body.password });
        await user.save();
    } catch (error) {
        res.status(404).send("Failed to signup");
    }
})

module.exports = router;