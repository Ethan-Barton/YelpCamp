require('dotenv').config();
const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      flash          = require("connect-flash"),   
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      Campground     = require("./models/campground"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      SeedDB         = require("./seeds");

      
// requiring routes
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      reviewRoutes     = require("./routes/reviews"),
      indexRoutes      = require("./routes/index");
      

// seed the database
// SeedDB();

// mongoose config
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
// mongoose.connect("mongodb://localhost/yelp_camp_v22");
mongoose.connect("mongodb+srv://itzbige:<Tmmre123$!TX>@cluster0-gh6wj.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("connected to db!");
}).catch(err => {
    console.log("ERROR", err.message);
});

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again bear is the best dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate(), function(username, password, done){
    User.findOne({username: username}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: "Incorrect username."});
        }

        if(!user.validPassword(password)){
            return done(null, false, {message: "Incorrect Password."});
        }

        return done(null, user);
    });
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// currentUser and flash message config
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//routes config
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Server Config
app.listen(3000, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});