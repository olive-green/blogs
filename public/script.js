let username
let socket=io()

do{
    username=prompt("enter your name : ")

}while(!username)



    
const textArea=document.querySelector("#textarea")
const submitBtn=document.querySelector("#submitBtn")
const commentBox=document.querySelector(".comment_box")
const postId=document.getElementById("postId").value

submitBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    let comment=textarea.value
    if(!comment){
        return
    }
    postComment(comment)
})



function postComment(comment)
{
    //Append to dom
    // Broadcast
    // Sync with Mongodb

    //append to dom
    let data={
        postId:postId,
        username:username,
        comment:comment
    }
    appendToDom(data)

    //To clear the textarea after writing some data in it
    textArea.value=""

    // Broadcast channel
    broadcastComment(data);

    //Sync with Mongodb
    syncWithDb(data)
    
}

function appendToDom(data)
{
    let liTag=document.createElement("li")
    liTag.classList.add("comment", "mb-3")

    let markup=`
       <div class="card border-light mb-3">
            <div class="card-body">
                <h5>${data.username}</h5>
                <p>${data.comment}</p>
            </div>
            <div>
                <img src="" alt="">
                <small>${moment(data.time).format("LT")}</small>
            </div>
        </div>
    
    `
    liTag.innerHTML=markup
    
    commentBox.prepend(liTag)
}

function broadcastComment(data){
    // socket 
    socket.emit("comment",data)
}

socket.on("comment",(data)=>{
    appendToDom(data)
})

//typing  event
//event listener on textarea
textArea.addEventListener("keyup",(e)=>{
    socket.emit("typing",{username:username})
})

// recieving typing event from the server
//Firstly create a typingDiv element
let typingDiv=document.querySelector(".typing")

//creating a debounce function
let timerId=null
function debounce(func,timer)
{
    if(timerId){
        clearTimeout(timerId)
    }
    timerId=setTimeout(() => {
        func()
    }, timer);
}


socket.on("typing",(data)=>{
    typingDiv.innerText=`${data.username} is typing....`
    //creating a debounce function for realtime indicator of typing
    debounce(function(){
        typingDiv.innerText=""
    },1000)
})

// API calls

//sycnWithDb function
function  syncWithDb(data){
    // Now we are sending data from client to server then from this server to db
    // we are using fetch to send data
    //headers- they are used to define which type of data are sending
    const headers={
        "Content-Type":"application/json"
    }
    fetch("/comments/:postId",{method:"POST",body: JSON.stringify(data),headers}) //in this fetch we have second argument where we are sending data in the form of JSON
    .then(response => response.json()) //here we are recieving response in string format so we converted it into json
    .then(result =>{
        console.log(result)
    })
}


// fetching comments
function fetchComments()
{
    console.log("function called");
    fetch(`/comments/${postId}`) //by default fetch's method is get
    .then(res =>res.json())
    .then(result=>{
        result.forEach(comment => {
            comment.time=comment.createdAt //it is because in data object we add time property so that we are adding time property to comment
            appendToDom(comment);
        });
    })
};


window.onload=fetchComments();