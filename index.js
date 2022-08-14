const express = require('express')
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const path = require('path');
const hikings = require('./routes/hiking')
const reviews = require('./routes/review')

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

app.use("/hiking", hikings)
app.use("/hiking/:id/reviews", reviews)


app.get('/', (req, res) => {
    res.render('home')
})

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