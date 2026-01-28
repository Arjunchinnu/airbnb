const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemavalid.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

//reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  warpAsync(reviewController.createReview)
);

//Delete Reviews
router.delete(
  "/:reviewId",
  isReviewAuthor,
  warpAsync(reviewController.destroyReview)
);

module.exports = router;
