const passport=require("passport")
const User=require("../models/user.js");
const GoogleStrategy=require("passport-google-oauth20");
const HttpsProxyAgent = require('https-proxy-agent');
require("dotenv").config();

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
    callbackURL:"https://ssb-blogs.herokuapp.com/auth/google/redirect",
//     callbackURL:"/auth/google/redirect",
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
},(accessToken,refreshToken,profile,done)=>{
    ////accessToken is a token given by google to us , refreshToken is a token which regenerate the accessToken which gets expired always after some time and done is a function which will run after this callback function is completed 
    // console.log(profile)
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
            //example of profile object that we got
            // {
            //     id: '117194862761284547296',
            //     displayName: 'Pankaj Kumar',
            //     name: { familyName: 'Kumar', givenName: 'Pankaj' },
            //     photos: [
            //       {
            //         value: 'https://lh3.googleusercontent.com/a-/AOh14GhPTzpAYGceCsrSu7Z5Q7572cCoRAQutyix6VZFfQ=s96-c'
            //       }
            //     ],
            //     provider: 'google',
            //     _raw: '{\n' +
            //       '  "sub": "117194862761284547296",\n' +
            //       '  "name": "Pankaj Kumar",\n' +
            //       '  "given_name": "Pankaj",\n' +
            //       '  "family_name": "Kumar",\n' +
            //       '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GhPTzpAYGceCsrSu7Z5Q7572cCoRAQutyix6VZFfQ\\u003ds96-c",\n' +
            //       '  "locale": "en-GB"\n' +
            //       '}',
            //     _json: {
            //       sub: '117194862761284547296',
            //       name: 'Pankaj Kumar',
            //       given_name: 'Pankaj',
            //       family_name: 'Kumar',
            //       picture: 'https://lh3.googleusercontent.com/a-/AOh14GhPTzpAYGceCsrSu7Z5Q7572cCoRAQutyix6VZFfQ=s96-c',
            //       locale: 'en-GB'
            //     }
            //   }
            //user is not in database
            new User({
                username:profile.displayName, // this displayName property is provided by google
                googleId:profile.id,
                profileImg:profile.photos[0].value,
                email:profile.emails[0].value
            }).save().then(newUser=>{
                done(null,newUser);
                console.log("new user created:",newUser);
            })
        }
    })

}));
