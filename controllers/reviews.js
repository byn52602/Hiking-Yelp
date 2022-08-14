const Hiking = require('../models/Hiking');
const Review = require("../models/Review")

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    const newReview = new Review(req.body.review);
    hiking.reviews.push(newReview);
    await newReview.save();
    await hiking.save();
    req.flash('success', "Successfully added a new review!");
    res.redirect(`/hiking/${hiking._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Hiking.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted a review");
    res.redirect(`/hiking/${id}`)
}