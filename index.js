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
const MongoDBStore = require('connect-mongo');

const ExpressError = require('./utils/ExpressError')
const hikings = require('./routes/hiking')
const reviews = require('./routes/review')


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/hiking';
// const dbUrl = 'mongodb://localhost:27017/hiking'; //27017 is default port number. using test database
async function main() {
    await mongoose.connect(dbUrl);
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


const secret = process.env.SECRET || "notProductionSecret";
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600 //avoid unnecessary updates whenever user refreshes a page
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store: store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //millisecond in a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true //more security
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