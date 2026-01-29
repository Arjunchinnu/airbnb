require("dotenv").config();
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");

const ListingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to DB"))
//   .catch((err) => console.log("Error connecting to DB:", err));
// Connect IMMEDIATELY (let mongoose buffer queries - default behavior)
// ✅ REPLACE WITH THIS
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
};

// Call it immediately
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing JSON bodies (API requests)
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// const sessionOptions = {
//   secret: "mysupersecretcode",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     express: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    // ✅ FIXED
    mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // 👈 Render free tier
    sameSite: "lax", // 👈 Add this
  },
};

// Routes
app.get("/", (req, res) => {
  console.log("Connected to root");
  res.send("root route");
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(user.authenticate()));
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  console.log("req.user after passport:", req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  console.log("set res.locals.currUser:", res.locals.currUser);
  next();
});

// app.use((req, res, next) => {
//   console.log("setting locals.curruser", req.user);
//   res.locals.currUser = req.user;
//   console.log("oweingkkk", res.locals.currUser);
//   next();
// });

app.use("/listings", ListingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);

// app.get("/demo", async (req, res) => {
//   let fakeUser = new user({
//     email: "student@gmail.com",
//     username: "delta-kk",
//   });
//   let newUser = await user.register(fakeUser, "helloworld");
//   res.send(newUser);
// });

app.get("/", async (req, res) => {
  console.log("You are in listing");
  try {
    const listings = await Listing.find({}); // You'll need this model
    res.render("listings/home", { listings });
  } catch (err) {
    res.render("listings/home", { listings: [] });
  }
});

// Catch-all 404 route
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  let { statusCode = 500, message = "Something went wrong" } = err;
  // If request expects HTML, render error page, else JSON
  res.status(statusCode).render("error.ejs", { statusCode, message });
  // if (req.accepts("html")) {
  //   res.status(statusCode).render("error.ejs", { statusCode, message });
  // } else {
  //   res.status(statusCode).json({ error: message });
  // }
});

//   let { statusCode = 500, message = "something went wrong" } = err;
//   res.render("error.ejs", { statusCode, message });
// res.status(statusCode).send(message);

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
});
