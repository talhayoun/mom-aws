const mongoose = require("mongoose");
const mealsSchema = new mongoose.Schema({
    title: String,
    time: Number,
    ingredients: [String],
    image: String,
    steps: [String],
});

const Meal = mongoose.model("meal", mealsSchema);

module.exports = Meal;
