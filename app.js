const express=require("express")
const app=express()
const articleRouter=require("./routes/articles")
const authRoutes=require("./routes/auth-routes");
const Comment=require("./models/comment")
const mongoose=require('mongoose')
const Article=require('./models/article.js')
const methodOverride=require("method-override");
const cors=require('cors')
const keys=require("./config/keys");
const passport=require("passport")
//importing passport-setup.js to run google strategy
const passportSetup=require("./config/passport-setup");
const cookieSession=require("cookie-session")

require("dotenv").config();

const port= process.env.PORT || 3000


//connect database
// mongoose.connect("mongodb+srv://pankaj:snSC0vbIgRWi3pme@cluster0.82akh.mongodb.net/blogs?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connect(process.env.dbURL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log(err))

//here we are telling server what kind of data we are recieving
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cors())
app.use(express.urlencoded({extended:false}));

app.use(methodOverride("_method"))


//setting cookies
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[process.env.key] //import encrypted key from keys
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/articles',articleRouter);
app.use("/auth",authRoutes);

//authCheck function
const authCheck=(req,res,next)=>{
    if(!req.user){
        //if user is not logged in
        res.redirect("/login")
    }
    else
    {
        next();
    }
}
app.get('/',authCheck,async (req,res)=>{

    const articles=await Article.find();
    let pageTitle = "Blogs";
    let cssName = "header.css";

    res.render("articles/index",{articles:articles,pageTitle: pageTitle,cssFile: cssName,user:req.user})
});

app.get('/login',(req,res)=>{
    let pageTitle="Login";
    res.render("login",{pageTitle:pageTitle});
});





//Routes for post request from client 
app.post("/comments/:postId",(req,res)=>{
    const comment= new Comment({
        postId:req.body.postId,
        username:req.body.username,
        comment:req.body.comment
    })

    comment.save().then((response)=>{
        res.send(response)
    })
})

//creating a get route for fetching all comments
app.get("/comments/:postId",authCheck,(req,res)=>{
    let postId=req.params.postId
    // console.log(postId)
    Comment.find({postId:postId}).then(function(comments){
        console.log(comments)
        res.send(comments)
    })
})




const server=app.listen(port,()=>{
    console.log(`Server is listening on ${port}`)
})

let io=require("socket.io")(server)

io.on("connection",(socket)=>{
    console.log(`new connection ${socket.id}`)

    

    // Recieve event
    socket.on("comment",(data)=>{
        // console.log(data)
        //add time property to data
        data.time=Date()
        socket.broadcast.emit("comment",data);

    })

    //recieving typing event
    socket.on("typing",(data)=>{
        socket.broadcast.emit("typing",data)
    })

})
