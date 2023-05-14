const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user');


passport.use(new LocalStrategy({
    usernameField: 'email'
},
    // (email, password, done) => {
    //     // find a user and establish the identity 
    //     User.findOne({ email: email }, (err, user) => {
    //         if (err) {
    //             console.log('error in finding user-->passport');
    //             return done(err);
    //         }
    //         if (!user || user.password != password) {
    //             console.log('invalid username/password-');
    //             return done(null, false);
    //         }
    //         return done(null, user);
    //     })
    // }

    function(email,password,done){
        User.findOne({email:email})
        .then(function(user){
            if(!user || user.password!= password){
                console.log('invalid username/password');
                return done(null,user);
            }
            return done(null,user);
        })
    }
))

// serializing the user to decide whick key is kept in the cookies 
passport.serializeUser(function(user, done){
    done(null, user.id);
})

// deserializing the user from the key int the cookies 
passport.deserializeUser(function(id, done) {
    User.findById(id)
    .then(function(user){

        if(!user){
           console.log('error in finding user-->passport');
           return done(null,false); 
        }
        return done(null,user);
    })
        // if (err) {
        //     console.log('error in finding user-->passport');
        //     return done(err);
        // }
        // return done(null, user);
    })


//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is sign-in , then pass on the request to the next function(controller action )
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not sign-in
    return res.redirect('/users/sign-up');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()) {
        // requesr.use contains the current signin user from the session cookie 
        // and we are sending this to the locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;