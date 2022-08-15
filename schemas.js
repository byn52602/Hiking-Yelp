const Joi = require('joi')

module.exports.hikingSchema = new Joi.object({
    hiking: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        lengthKM: Joi.number().required().min(0),
        difficulty: Joi.string().required(),
        // image: Joi.array().required(),
        description: Joi.string().required()
    }).required()
})   //This is NOT mongoose schema, this is EVEN before mongo db

module.exports.reviewSchema = new Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required()
    }).required()
})