const Listings = require("./models/listing");
const Reviews = require("./models/review.js");
const listingSchema = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schemavalid.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req);
    req.session.redirect = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirect) {
    res.locals.redirectUrl = req.session.redirect;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listings.findById(id);
  if (!list.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validating listing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing); //i changed
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Reviews.findById(reviewId);
  console.log(review);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
