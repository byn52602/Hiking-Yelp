if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session')
const flash = require("connect-flash")

const ExpressError = require('./utils/ExpressError')
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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: "notProductionSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //millisecond in a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        HttpOnly: true //more security
    }
}
app.use(session(sessionConfig))
app.use(flash())

//middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

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