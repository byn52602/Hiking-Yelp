const express = require('express')
const mongoose = require("mongoose")
const Hiking = require('./models/Hiking');
const Review = require("./models/Review")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const path = require('path');
const { hikingSchema, reviewSchema } = require('./schemas')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/hiking'); //27017 is default port number. using test database
}
main().catch(err => console.log('Error!', err));
main().then(() => console.log("Mongoose Connected!"))

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',') // details is an array of objects
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/hiking', catchAsync(async (req, res) => {
    const hikings = await Hiking.find();
    res.render('hiking/index', { hikings })
}))

app.get('/hiking/new', (req, res) => {
    res.render('hiking/new');
})

app.post('/hiking', validateHiking, catchAsync(async (req, res) => {
    const newHiking = new Hiking(req.body.hiking);
    await newHiking.save();
    res.redirect(`/hiking/${newHiking._id}`)
}))

app.get('/hiking/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id).populate('reviews');
    res.render('hiking/show', { hiking })
}))

app.get('/hiking/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    res.render('hiking/edit', { hiking })

}))

app.put('/hiking/:id', validateHiking, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndUpdate(id, { ...req.body.hiking });
    res.redirect(`/hiking/${hiking._id}`)
}))

app.delete('/hiking/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndDelete(id);
    res.redirect('/hiking')
}))


app.post('/hiking/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    const newReview = new Review(req.body.review);
    hiking.reviews.push(newReview);
    await newReview.save();
    await hiking.save();
    res.redirect(`/hiking/${hiking._id}`)
}))

app.delete('/hiking/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hiking.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hiking/${id}`)
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something went wrong:(";
    res.status(err.statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})