require('dotenv').config();

const   express              = require('express');
        app                  = express();
        port                 = process.env.PORT || 3000;
        bodyParser           = require("body-parser");
        mongoose             = require("mongoose");
        flash                = require("connect-flash");
        passport             = require("passport");
        LocalStrategy        = require("passport-local");
        methodOverride       = require("method-override");
        Campground           = require("./models/campground");
        Comment              = require("./models/comment");
        User                 = require("./models/user");
        seedDB               = require("./seeds");
        uri                  = process.env.MONGODB_URI;

//requiring routes
const   commentRoutes        = require("./routes/comments");
        campgroundRoutes     = require("./routes/campgrounds");
        authRoutes           = require("./routes/index");

seedDB(); //seed the database

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   
mongoose.connect(uri);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again we are here",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, () =>{
    console.log("The YelpCamp Server Has Started!");
});