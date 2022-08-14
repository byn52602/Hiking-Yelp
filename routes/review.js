const express = require("express")
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Hiking = require('../models/Hiking');
const Review = require("../models/Review")
const { reviewSchema } = require('../schemas')

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',') // details is an array of objects
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    const newReview = new Review(req.body.review);
    hiking.reviews.push(newReview);
    await newReview.save();
    await hiking.save();
    res.redirect(`/hiking/${hiking._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hiking.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hiking/${id}`)
}))

module.exports = router;