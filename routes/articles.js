const express=require('express')
const mongoose=require('mongoose');
const Article=require('./../models/article.js');
var router=express.Router();



router.get('/new',(req,res)=>{
    res.render("articles/newArticle",{article: new Article()});
})

router.get('/:id', async (req,res)=>{
    // res.send(req.params.id);
    let article= await Article.findById(req.params.id);
        if(article == null)
        {
            res.redirect('/');
        }
      res.render('articles/show',{article:article});  
})

router.get('/edit/:id', async (req,res)=>{
    // res.send(req.params.id);
    let article= await Article.findById(req.params.id);
   res.render('articles/edit',{article:article});  
})


router.post('/',async (req,res)=>{
    let article= new Article({
        title:req.body.title,
        Shortdescription:req.body.Shortdescription,
        Fulldescription:req.body.Fulldescription,
        social:req.body.social,
        image:req.body.image
    })

    try{
        article= await article.save()
        res.redirect(`/articles/${article.id}`)
    }
    catch(err){
        console.log(err)
        res.render('articles/newArticle',{article:article})
    }
})

router.put('/:id',(req,res,next)=>{
    req.article= new Article()
    next()
},saveArticleAndRedirect('new'))


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
            res.render('articles/${path}',{article:article})
        }   
    }
}


router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports=router;