const Joi = require('joi')

module.exports.hikingSchema = new Joi.object({
    hiking: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        lengthKM: Joi.number().required().min(0),
        hours: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})   //This is NOT mongoose schema, this is EVNE before mongo db
