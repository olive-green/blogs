const express=require("express")
const app=express()
const articleRouter=require("./routes/articles")
const mongoose=require('mongoose')
const Article=require('./models/article.js')
const methodOverride=require("method-override");


// user:photon
// password:gKvkkkktZjg6PebF
//connect database
mongoose.connect("mongodb+srv://photon:gKvkkkktZjg6PebF@cluster0.82akh.mongodb.net/blogs?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log(err))


app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(express.urlencoded({extended:false}));

app.use(methodOverride("_method"))

app.get('/',async (req,res)=>{

    const articles=await Article.find();
    let pageTitle = "Blogs";
    let cssName = "header.css";

    res.render("articles/index",{articles:articles,pageTitle: pageTitle,cssFile: cssName})
});

app.use('/articles',articleRouter);

app.listen(3000,()=>{
    console.log("Server is listening on port 3000");
})
