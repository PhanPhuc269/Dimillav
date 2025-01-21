class BlogController{
    blog(req,res,next){
        res.render('blog');
    }
    details(req,res,next){
        res.render('single-blog');
    }
    
}

module.exports = new BlogController();