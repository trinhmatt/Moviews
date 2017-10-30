var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    request = require('request')
    User = require('./models/user.js'),
    LocalStrategy = require('passport-local');

mongoose.connect('mongodb://localhost/moviews');
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(require('express-session')({
  secret: 'This is the secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res){
  res.render('landing')
})

app.get('/register', function(req, res){
  res.render('register')
})

app.get('/home', isLoggedIn, function(req, res){
  res.render('home')
})

app.post('/register', function(req, res){
  var username = new User({username:req.body.username}),
      password = req.body.password;
  User.register(username, password, function(err, user){
    if (err){
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function(){
      //This should be different later
      res.redirect('/campgrounds')
    })
  })
})

//LOGIN ROUTES
app.get('/', function(req, res){
  res.render('login')
})

app.post('/', passport.authenticate('local',{
  successRedirect:'/home',
  failureRedirect:'/login'
}),function(req, res){
});

//LOGOUT
app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}

app.listen(3000, function(){
  console.log('Server started');
});
