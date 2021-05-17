const router=require("express").Router()
const passport=require("passport");
const session=require("express-session")

// auth/google route
router.get("/google",passport.authenticate("google",{
    scope:["profile"]
}));

// callback route for google to redirect when user grants permission at consent screen
router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{ //now before this function fired , passport.authenticate middleware is fired , now this time it does not take over to google consent screen instead of that it return user profile data fetches from query string of this route
    res.redirect("/");

    
});
//creating logout route
// router.get("/logout",(req,res)=>{
//     req.session.destroy((err)=>{
//         if(err) throw err;
//         res.redirect("/");
//     });//it is passport function , it will do our work automatically
// });

router.get("/logout",(req,res)=>{
    req.logout();//it is passport function , it will do our work automatically
    res.redirect("/")
    // res.send("logout");
})
module.exports=router;