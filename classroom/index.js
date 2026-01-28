const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOption = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
};

// app.use(cookieParser());
app.use(session(sessionOption));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/register", (req, res) => {
  let { name = "anonymus" } = req.query;
  req.session.name = name;
  req.flash("succes", "regisration completed");
  req.res.redirect("/hello");
});

app.get("/hello", (req, res) => {

  res.render("page.ejs", { name: req.session.name, msg: req.flash("succes") });
});

// app.get("/test", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`number ${req.session.count}`);
// });

app.listen(3030, () => {
  console.log(`port is running at http://localhost:3030`);
});
