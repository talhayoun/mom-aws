const express = require("express");
const router = express.Router();
const Meal = require("../models/mealsModel");
const upload = require("../utils/multer");
const path = require("path");
const auth = require("../middleware/auth");


router.get("/meal", async (req, res) => {
    try {
        const meals = await Meal.find();
        res.json({ meals });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Failed to get meals" })
    }
})

router.post("/meal", upload.single('image'), async (req, res) => {
    try {
        const imagePathName = req.file.filename;
        let { title, time, ingredients, steps } = req.body;

        if (!title || !time || !ingredients || !steps) {
            return res.status(500).json({ error: "All fields are required" });
        }
        ingredients = JSON.parse(ingredients)
        steps = JSON.parse(steps);

        const newMeal = await new Meal({ title, time, ingredients, image: imagePathName, steps });
        await newMeal.save();
        res.json({ newMeal });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Failed to create a new meal" })
    }
})

router.get("/meal/:id", async (req, res) => {
    try {
        const mealId = req.params.id;
        console.log(mealId)
        if (!mealId) return res.status(500).json({ error: "Failed to get meal by id" })

        const meal = await Meal.findById(mealId);

        if (!meal) return res.status(404).json({ error: "No meal with that ID" });

        res.json({ meal });
    } catch (error) {
        res.status(404).json({ error: "Failed to get meal" })
    }
})

router.get("/image/:id", async (req, res) => {
    try {
        const imageId = req.params.id;
        if (imageId)
            res.sendFile(path.join(__dirname, "..", "..", "uploads", imageId));
    } catch (error) {
        res.status(404).json({ error: "Failed to load image" })
    }
})

router.delete("/meal/:id", async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Failed to delete item' })
    }
})

router.patch('/meal/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        let image;
        if (req.file) image = req.file.filename;

        let { title, ingredients, steps, time } = req.body;
        ingredients = JSON.parse(ingredients);
        steps = JSON.parse(steps);

        const updatedMeal = await Meal.findByIdAndUpdate(id, { title, ingredients, steps, time, image });
        await updatedMeal.save();
        res.json({ message: 'Updated successfully' })
    } catch (error) {
        res.status(404).json({ error: 'Failed to update meal' });
    }
})

module.exports = router;