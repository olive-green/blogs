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
            article.author="pankaj"
            article.profileImg="data:image/jpeg;base64,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"
            article.googleId="sdfkl"
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


router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports=router;
