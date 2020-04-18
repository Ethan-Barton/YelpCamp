const mongoose = require("mongoose");
const Comment = require('./comment');




// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    address: String,
    contactEmail: String,
    contactNumber: String,
    image: String,
    imageId: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

campgroundSchema.pre('remove', async function() {
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});


module.exports = mongoose.model("Campground", campgroundSchema);
