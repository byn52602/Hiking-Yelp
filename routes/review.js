const express = require("express")

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Hiking = require('../models/Hiking');
const Review = require("../models/Review")
const { reviewSchema } = require('../schemas')
const reviews = require("../controllers/reviews")

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

router.post('/', validateReview, catchAsync(reviews.addReview))

router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router;