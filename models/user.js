const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    username:String,
    googleId:String,
    profileImg:String
})

module.exports=mongoose.model("user",userSchema);