const express = require('express')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const methodOverride = require('method-override')
const AppError = require('./utils/error')
const campRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviewroutes')
const userRoutes = require('./routes/userRoutes')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const User = require('./models/users')
const passport = require('passport')
const localStrategy = require('passport-local')
const Campground = require('./models/campground')
require('dotenv').config()

const MongoStore = require('connect-mongo');

const mongoDbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("database connected"))
.catch(err=>console.log(err))


const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'templates'))
app.engine('ejs',engine)

const store = MongoStore.create({
    mongoUrl: mongoDbUrl,
    touchAfter: 24 * 3600, // time period in seconds

  })

const secret = process.env.SECRET || 'randomsecret'
const sessionConfig = {
  secret,
  store,
  resave: false,
  saveUninitialized: true,
  cookie: { 
      httpOnly: true,
      expires: Date.now() + 1000*60*60*24*7,
      maxAge: 1000*60*60*24*7
   }
   
}
app.use(session(sessionConfig))

app.use(flash())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    
    
    next()
})



app.use('/campgrounds', campRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})


app.use(express.static(path.join(__dirname,'public')))




app.use((err,req,res,next)=>{
    
    if(err.name==="CastError"){
    
    next(new AppError("castError",404))
    }
    else if(err.name==="ValidationError"){
    
        next(new AppError("validationError", 403))
    }else{
        
        next(err)

    }
})


app.use((err,req,res,next)=>{
    const { status=404, message="something went wrong"} = err
    
    
    if(err.code=="LIMIT_UNEXPECTED_FILE"){
        req.flash('error', "only 2 files are allowed")
        res.redirect(req.session.currentPath)
    }else{
    res.status(status).render('error', {err})
    }
    
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`listening on port: ${PORT}`)
})
