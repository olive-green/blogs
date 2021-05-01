const mongoose=require('mongoose')

const articleSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    Fulldescription:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    Shortdescription:{
        type:String,
        required:true
    },
    social:{
        type:String
    },
    image:{
        type:String,
        required:true
    }
})

module.exports=  mongoose.model("Article",articleSchema);