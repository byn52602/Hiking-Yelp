const express = require("express")

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Hiking = require('../models/Hiking');
const { hikingSchema } = require('../schemas')

const router = express.Router();


const validateHiking = (req, res, next) => {
    // if (!req.body.hiking) throw new ExpressError('Invalid Data', 400);
    const { error } = hikingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',') // details is an array of objects
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const hikings = await Hiking.find();
    res.render('hiking/index', { hikings })
}))

router.get('/new', (req, res) => {
    res.render('hiking/new');
})

router.post('/', validateHiking, catchAsync(async (req, res) => {
    const newHiking = new Hiking(req.body.hiking);
    await newHiking.save();
    req.flash('success', "Successfully added a new hiking trail");
    res.redirect(`/hiking/${newHiking._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id).populate('reviews');
    if (!hiking) {
        req.flash('error', "Cannot find that hiking trail!");
        return res.redirect('/hiking')
    }
    res.render('hiking/show', { hiking })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    if (!hiking) {
        req.flash('error', "Cannot find that hiking trail!");
        return res.redirect('/hiking')
    }
    res.render('hiking/edit', { hiking })

}))

router.put('/:id', validateHiking, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndUpdate(id, { ...req.body.hiking });
    req.flash('success', "Successfully updated this hiking trail");
    res.redirect(`/hiking/${hiking._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted a hiking trail");
    res.redirect('/hiking')
}))

module.exports = router;