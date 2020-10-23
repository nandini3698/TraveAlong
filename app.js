var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname+'/public'));
seedDB();

// PASSPORT CONFIGURATION

app.use(require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes SetUp

app.get('/',function(req,res){
    res.render('landing');
});

// INDEX Route - Shows all campgrounds
app.get('/campgrounds',function(req,res){
    // Get all campgrounds from DBs instead
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index',{campgrounds: allCampgrounds});
        }
    });
});

// CREATE Route - Adds new campground to DB
app.post('/campgrounds',function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Instead, create a new campground and save to DB 
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds')
        }
    });
});

// NEW Route - shows from to create new campground
app.get('/campgrounds/new',function(req,res){
    res.render('campgrounds/new')
});

// Ordering of routes matter as can be seen here
// SHOW Route - Shows more info about the campground with provided ID
app.get('/campgrounds/:id',function(req,res){
    // Find the Campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err) console.log(err);
        else{
            res.render('campgrounds/show',{campground: foundCampground});
        }
    });
});

// ========================================
// COMMENT ROUTES
// ========================================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req,res){
    // find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err) console.log(err);
        else{
            res.render('comments/new',{campground: campground});
        }
    })
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req,res){
    // Lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }
        else{
            // Create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });       
});

// ================================
// AUTH ROUTES
// =================================

// show register form
app.get('/register',function(req,res){
    res.render('register');
});

// handle signup logic
app.post('/register',function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/campgrounds');
        });
    });
});

// show login form
app.get('/login',function(req,res){
    res.render('login');
});

// handle login logic
app.post('/login',passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req,res){
});

// logout route
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campgrounds')
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Port
app.listen(3000,function(req,res){
    console.log('YelpCamp Server Started!');
});