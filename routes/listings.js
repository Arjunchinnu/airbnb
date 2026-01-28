const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/")
  .get(warpAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    warpAsync(listingController.createNewListings),
  );

router
  .route("/:id")
  .get(warpAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    warpAsync(listingController.updateListings),
  )
  .delete(isLoggedIn, isOwner, warpAsync(listingController.destoryListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  warpAsync(listingController.renderEditForm),
);

module.exports = router;
