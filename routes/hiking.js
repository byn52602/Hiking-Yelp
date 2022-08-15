const express = require("express")
const multer = require("multer")

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Hiking = require('../models/Hiking');
const { hikingSchema } = require('../schemas')
const hikings = require("../controllers/hiking")
const { storage } = require("../cloudinary");

const router = express.Router();
const upload = multer({ storage })

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

router.get('/', catchAsync(hikings.index))

router.get('/new', hikings.renderNewForm)

router.post('/', upload.array('image-file'), validateHiking, catchAsync(hikings.createNewTrail))

router.get('/:id', catchAsync(hikings.showOneTrail))

router.get('/:id/edit', catchAsync(hikings.renderUpdateForm))

router.put('/:id', upload.array('image-file'), validateHiking, catchAsync(hikings.updateTrail))

router.delete('/:id', catchAsync(hikings.deleteTrail))

module.exports = router;