// const User = require("../models/user");
// module.exports.renderSignupForm = (req, res) => {
//   res.render("users/signup.ejs");
// };

// // module.exports.signup = async (req, res) => {
// //   try {
// //     let { username, email, password } = req.body;
// //     const newUser = new user({ username, email });
// //     const registeredUser = await user.register(newUser, password);
// //     console.log(registeredUser);
// //     req.login(registeredUser, (err) => {
// //       if (err) {
// //         return next(err);
// //       }
// //       req.flash("success", "Welcome to Wanderland");
// //       res.redirect("/listings");
// //     });
// //   } catch (err) {
// //     req.flash("error", err.message);
// //     res.redirect("/users/signup");
// //   }
// // };

// // ✅ FIXED
// module.exports.signup = async (req, res, next) => {
//   // 👈 Add next
//   try {
//     let { username, email, password } = req.body;
//     const newUser = new User({ username, email }); // 👈 Capital U
//     const registeredUser = await newUser.register(newUser, password);
//     console.log(registeredUser);
//     req.login(registeredUser, (err) => {
//       if (err) return next(err); // ✅ Now works
//       req.flash("success", "Welcome to Wanderland");
//       res.redirect("/listings");
//     });
//   } catch (err) {
//     req.flash("error", err.message);
//     res.redirect("/users/signup");
//   }
// };

// module.exports.renderLoginForm = (req, res) => {
//   res.render("users/login.ejs");
// };

// module.exports.login = async (req, res) => {
//   req.flash("success", "Welcome back to Wanderlust");
//   let redirectUrl = res.locals.redirectUrl || "/listings";
//   res.redirect(redirectUrl);
// };

// module.exports.logout = (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       req.flash("error", "Some issue occurred during logout");
//       return next(err);
//     }
//     req.flash("success", "You are logged out");
//     res.redirect("/listings");
//   });
// };

const user = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// module.exports.signup = async (req, res) => {
//   try {
//     let { username, email, password } = req.body;
//     const newUser = new user({ username, email });
//     const registeredUser = await user.register(newUser, password);
//     console.log(registeredUser);
//     req.login(registeredUser, (err) => {
//       if (err) {
//         return next(err);
//       }
//       req.flash("success", "Welcome to Wanderland");
//       res.redirect("/listings");
//     });
//   } catch (err) {
//     req.flash("error", err.message);
//     res.redirect("/users/signup");
//   }
// };

// ✅ FIXED
module.exports.signup = async (req, res, next) => {
  // 👈 Add next
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email }); // 👈 Capital U
    const registeredUser = await newUser.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err); // ✅ Now works
      req.flash("success", "Welcome to Wanderland");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/users/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Some issue occurred during logout");
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
