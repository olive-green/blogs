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

router.get('/new',authCheck,(req,res)=>{
    let pageTitle="New Articles";
    let cssName = "./../newArticle.css";
    res.render("articles/newArticle",{article: new Article(),pageTitle: pageTitle,cssFile: cssName,user:req.user});
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