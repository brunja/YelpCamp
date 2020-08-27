const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middlewareObj = require("../middleware");

//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});

//Register Form Route
router.get("/register", (req, res) =>{
    res.render("register", {page: 'register'});
});
//handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    if (req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) =>{
    res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) =>{
});

//logout route
router.get("/logout", (req, res) =>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;