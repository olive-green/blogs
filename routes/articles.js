const express=require('express')
const mongoose=require('mongoose');
const Article=require('./../models/article.js');
var router=express.Router();


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
/* Rest Api for frontend */
router.get('/getBlogs', async (req, res) => {
    console.log("get request made")
    const articles=await Article.find();
    console.log(articles)
    res.status(200).json({
        success:true,
        count:articles.length,
        data:articles
    })
})

router.get('/new',authCheck,(req,res)=>{
    let pageTitle="NewArticles";
    let cssName = "./../newArticle.css";
    res.render("articles/newArticle",{article: new Article(),pageTitle,cssFile: cssName,user:req.user});
})



router.post('/',async (req,res,next)=>{
    req.article= new Article();
    next();
},saveArticleAndRedirect("newArticle"))

router.put('/:id',async (req,res,next)=>{
    req.article= await Article.findById(req.params.id);
    next()
},saveArticleAndRedirect('edit'))


function saveArticleAndRedirect(path){
    return async (req,res)=>{
        let article= req.article
            article.author=req.user.username
            article.profileImg=req.user.profileImg
            article.googleId=req.user.googleId
            article.title=req.body.title
            article.Shortdescription=req.body.Shortdescription
            article.Fulldescription=req.body.Fulldescription
            article.social=req.body.social
            article.image=req.body.image
        
    
        try{
            article= await article.save()
            res.redirect(`/articles/${article.id}`)
        }
        catch(err){
            console.log(err)
            res.render(`articles/${path}`,{article:article})
        }   
    }
}


router.get('/:id', authCheck,async (req, res) => {
    let pageTitle = "Blog";
    let cssName = "./../showblog.css";
    // res.send(req.params.id);
    let article= await Article.findById(req.params.id);
        if(article == null)
        {
            res.redirect('/');
    }
    // console.log(article);
      res.render('articles/show',{article:article,pageTitle,cssFile: cssName,user:req.user});  
})

router.get('/edit/:id',authCheck, async (req,res)=>{
    // res.send(req.params.id);
    let article= await Article.findById(req.params.id);
   res.render('articles/edit',{article:article,user:req.user});  
})


router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports=router;
