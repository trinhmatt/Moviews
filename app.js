//API KEY = 0e5bea19bca627a9999ab87fc9bb53f3
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    passport = require('passport'),
    request = require('request')
    User = require('./models/user.js'),
    List = require('./models/list.js'),
    LocalStrategy = require('passport-local');

mongoose.connect('mongodb://localhost/moviews');
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(flash());
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

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.get('/', function(req, res){
  res.render('landing')
})

app.get('/register', function(req, res){
  res.render('register')
})

app.get('/home', isLoggedIn, function(req, res){
  res.render('home')
})

//USER SHOW PAGE
app.get('/home/:id', function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if (err) {
      console.log(err)
    } else {
      var searchUser = {
        id: foundUser._id,
        username: foundUser.username
      }
      List.findOne({owner: searchUser}, function(err, foundList){
        if (!err) {
          res.render('profile', {user: foundUser, list: foundList})
        } else {
          console.log(err)
        }
      })
    }
  })
})

app.put('/home/:id', function(req, res){
  var movie = {
    title: req.body.title,
    poster: req.body.poster
  }
  User.findById(req.params.id, function(err, foundUser){
    if (!err) {
      var searchUser = {
        id: foundUser._id,
        username: foundUser.username
      }
      List.findOneAndUpdate({owner:searchUser},{$push: {"movies": movie}}, {new:true},function(err, updatedList){
        if (err) {
          console.log(err)
        } else {
          res.render('profile',{list:updatedList, user:foundUser})
        }
      })
    }
  })
})

app.post('/register', function(req, res){
  var username = new User({username:req.body.username}),
      password = req.body.password;

  User.register(username, password, function(err, user){
    if (err){
      console.log(err)
      return res.render('register')
    }
    var list = {
      movies: [],
      owner: {
        id: user._id,
        username: user.username
      }
    };
    List.create(list, function(err, newList){
      if (!err){
        passport.authenticate('local')(req, res, function(){
          res.redirect('/home')
        })
      } else {
        console.log(err)
      }
    })
  })
})

//SEARCH ROUTE
app.post('/search', function(req, res){
  var movie = req.body.movie,
      apiURL = 'https://api.themoviedb.org/3/search/movie?api_key=0e5bea19bca627a9999ab87fc9bb53f3&language=en-US&query='+movie+'&page=1&include_adult=false'
  request(apiURL, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      res.render('search', {movie: info})
    }
  })
})

//SHOW ROUTE
app.post('/search/:title', function(req, res){
  var movie = {
    title: req.body.title,
    poster: req.body.poster
  }
  res.render('show', {movie: movie})
})

//LOGIN ROUTES
app.get('/', function(req, res){
  res.render('login')
})

app.post('/', passport.authenticate('local',{
  successRedirect:'/home',
  failureRedirect:'/'
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