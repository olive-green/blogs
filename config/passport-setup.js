const passport=require("passport")
const keys= require("./keys")
const User=require("../models/user.js");
const GoogleStrategy=require("passport-google-oauth20");
const HttpsProxyAgent = require('https-proxy-agent');

//create cookies
passport.serializeUser((user,done)=>{
    //now here we call done() function to move the user to next state 
    //it simply grabs the user from done() function and then stores into cookie
    done(null,user.id); //here id is from mongo collection
})

passport.deserializeUser((id,done)=>{
    //now we find that user with help of id and mathces with our cookie
    User.findById(id).then(user=>{
        done(null,user);
    })
})


//create a googleStrategy

passport.use(new GoogleStrategy({
    //options for google Strategy
    callbackURL:"/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
},(accessToken,refreshToken,profile,done)=>{
    ////accessToken is a token given by google to us , refreshToken is a token which regenerate the accessToken which gets expired always after some time and done is a function which will run after this callback function is completed 

    //now inside this callback function 
    // we check whether the user profile is stored in our database or not if not then we add this profile to our database and if yes then we just retreive the profile info from our database
    User.findOne({googleId:profile.id})
    .then(currentUser =>{
        if(currentUser)
        {
            //user is already exists
            done(null,currentUser);
        }
        else
        {
            //user is not in database
            new User({
                username:profile.displayName, // this displayName property is provided by google
                googleId:profile.id,
                // profileImg:profile._json.image.url
            }).save().then(newUser=>{
                done(null,newUser);
                console.log("new user created:",newUser);
            })
        }
    })

}));