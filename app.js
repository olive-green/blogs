const express=require("express")
const app=express()
const articleRouter=require("./routes/articles")
const mongoose=require('mongoose')
const Article=require('./models/article.js')
const methodOverride=require("method-override");


//connect database
mongoose.connect("mongodb://localhost/blogs",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log(err))


app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

app.use(methodOverride("_method"))

app.get('/',async (req,res)=>{

    const articles=await Article.find();

    res.render("articles/index",{articles:articles})
});

app.use('/articles',articleRouter);

app.listen(3000,()=>{
    console.log("Server is listening on port 3000");
})
