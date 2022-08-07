const session = require("express-session")
const Campground = require("./models/campground")
const Review = require("./models/reviews")


module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        
    
        
        req.flash('error', 'you must have to logged in first')
        res.redirect('/login')
        
    }else{
        next()
    }
}

module.exports.isAuthorized = async (req,res,next)=>{
    // let currpath = req.path.slice(1)
    // currpath = currpath.slice(0,currpath.search('/'))
    const {id} = req.params
    const camp = await Campground.findById(id).populate('author')
    

    if (camp.author.username===req.user.username){
        next()
    }
    else{
        req.flash('error', "Oopss!! you are not authorized to do that action")
        res.redirect(`/campgrounds/${id}`)
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id , reviewId} = req.params
    const review = await Review.findById(reviewId).populate('author')
    console.log(req.user.username==review.author.username)
    if(!((req.user.username)===(review.author.username))){
        console.log("reached to if")
        req.flash('error',"not authorized")
        res.redirect(`/campgrounds/${id}`)
}else{
    
    next()
}
}

module.exports.editFormPath = (req,res,next)=>{
    req.session.currentPath = req.originalUrl
    next()
}

