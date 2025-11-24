if(process.env.NODE_ENV != "production"){
 require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing.js');
const ExpressError = require('./utils/ExpressError.js');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


const db_url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");

    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(db_url);
}


app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);


const store = MongoStore.create({
    mongoUrl: db_url,
   
    touchAfter: 24* 3600,
})

store.on("error", () =>{
    console.log("Error in Mongo  session", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },

};

app.use(session(sessionOptions));
app.use(flash());

// app.get('/', (req, res) => {
//     res.send("Root working");
// });


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res ) =>{
//     let fakeUser = new User({
//         username:"demouser", email:"khanraunak0021@gmail.com"
//     });

//     let registeredUser =   await User.register(fakeUser, 'Raunak@021');
//     res.send(registeredUser);
// })


app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get("/", async (req, res) => {
    const listings = await Listing.find({}).populate('reviews');
    res.render("listings/listings.ejs", { listings });
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('listings/error.ejs', { statusCode, message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});