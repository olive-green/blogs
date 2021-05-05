const express=require("express")
// const port= process.env.PORT || 3000
const Comment=require("./../models/comment")

var router=express.Router()
// app.use(express.static("public"))

// db connection
// const mongoose=require("mongoose")
// const url="mongodb://localhost/comments"

// mongoose.connect(url,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useFindAndModify:true
// })
// const connection=mongoose.connection
// connection.once("open",function(){
//     console.log("Database connected...")
// }).catch(function(err){
//     console.log("Connection failed")
// })



//Routes for post request from client 
router.post("/api/comments",(req,res)=>{
    const comment= new Comment({
        username:req.body.username,
        comment:req.body.comment
    })

    comment.save().then((response)=>{
        res.send(response)
    })
})

//creating a get route for fetching all comments
router.get("/api/comments",(req,res)=>{
    Comment.find().then(function(comments){
        res.send(comments)
    })
})



// // const server=app.listen(port,()=>{
// //     console.log(`Server is listening on ${port}`)
// // })

// let io=require("socket.io")(server)

// io.on("connection",(socket)=>{
//     console.log(`new connection ${socket.id}`)
//     // Recieve event
//     socket.on("comment",(data)=>{
//         // console.log(data)
//         //add time property to data
//         data.time=Date()
//         socket.broadcast.emit("comment",data);

//     })

//     //recieving typing event
//     socket.on("typing",(data)=>{
//         socket.broadcast.emit("typing",data)
//     })

// })

module.exports=router;
