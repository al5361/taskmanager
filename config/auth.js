function allow(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error','Log in to access the page');
        res.redirect('/login');
    }
}

module.exports = {
    allow: allow
};