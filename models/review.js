const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating:{
        // set the field type
        type: Number,
        // star rating needs to be required
        required: "Please provide a rating (1-5 Stars).",
        // define min and max values
        min: 1,
        max: 5,
        // adding validation to see if the entry is an integer
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value"
        }
    },
    // review text
    text: {
        type: String,
    },
    // author id and username reference
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USer"
        },
        username: String
    },
    // campground reference
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }
},{
    // if timestamps are set to true, mongoose assigns createdAt and updatedAt to your Schema, the type is assigned to Date
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);