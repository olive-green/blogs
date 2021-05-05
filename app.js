const express=require("express")
const app=express()
const articleRouter=require("./routes/articles")
const Comment=require("./models/comment")
const mongoose=require('mongoose')
const Article=require('./models/article.js')
const methodOverride=require("method-override");
const port= process.env.PORT || 3000


// user:photon
// password:gKvkkkktZjg6PebF
//connect database
mongoose.connect("mongodb+srv://photon:gKvkkkktZjg6PebF@cluster0.82akh.mongodb.net/blogs?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log(err))

//here we are telling server what kind of data we are recieving
app.use(express.json())

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




//Routes for post request from client 
app.post("/api/comments",(req,res)=>{
    const comment= new Comment({
        username:req.body.username,
        comment:req.body.comment
    })

    comment.save().then((response)=>{
        res.send(response)
    })
})

//creating a get route for fetching all comments
app.get("/api/comments",(req,res)=>{
    Comment.find().then(function(comments){
        res.send(comments)
    })
})


app.use('/articles',articleRouter);


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
