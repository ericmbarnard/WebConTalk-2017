var express = require("express");
var passport = require("passport");
var GitHubStrategy = require('passport-github').Strategy;

exports.initialize = initialize;
exports.authFilter = getAuthFilter;

function initialize() {
    setupStrategies();

    var router = express.Router();

    router.get("/login", passport.authenticate("github"));

    router.get("/auth/github/callback", 
        passport.authenticate("github", { failureRedirect: '/login' }), 
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );
    
    
    router.get('/logout', function (req, res, next) {
        req.user = null;
        req.session = null;
        res.redirect("/login");
    });

    return router;
}

function getAuthFilter(){
    return function(req, res, next){
        if(!req.user){
            res.redirect("/login");
            return;
        }
        
        next();
    }
}

function setupStrategies(){
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        callbackURL: (process.env.SERVER_URL + '/auth/github/callback')
    },
        function(accessToken, refreshToken, profile, cb) {
            profile.accessToken = accessToken;
            return cb(null, profile);
        })
    );

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
}
