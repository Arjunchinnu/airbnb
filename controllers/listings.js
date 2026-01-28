const listing = require("../models/listing");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports.index = async (req, res) => {
  console.log("You are in listing");
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// module.exports.renderNewForm = (req, res) => {
// Make sure fetch is available (Node 18+) or use node-fetch polyfill if needed

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/add.ejs");
};

module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  const list = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(list);
  // console.log(currUser);
  // console.log(req.locals.currUser);
  if (!list) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { list });
};
// module.exports.createNewListings = async (req, res, next) => {
//   if (!req.body.listing) {
//     return next(new ExpressError(400, "Send valid data for listing"));
//   }

//   const apiKey = process.env.MAP_TOKEN;
//   const locationQuery = `${req.body.listing.country}, ${req.body.listing.location}`;
//   const encodedQuery = encodeURIComponent(locationQuery);
//   let geometry = null;

//   // try {
//   //   const response = await fetch(
//   //     `https://graphhopper.com/api/1/geocode?q=${encodedQuery}&key=${apiKey}`
//   //   );
//   // const data = await response.json();

//   // if (data.hits && data.hits.length > 0) {
//   //   const place = data.hits[0];
//   //   geometry = {
//   //     type: "Point",
//   //     coordinates: [place.point.lng, place.point.lat], // lng, lat order
//   //   };
//   //   console.log(place);
//   // }
//   // } catch (e) {
//   //   // handle error
//   // }

//   if (!geometry) {
//     req.flash("error", "Invalid location data.");
//     return res.redirect("/listings/new");
//   }

//   // // Example usage in your controller
//   // const newListing = new listing({
//   //   title: "Beach House",
//   //   description: "Beautiful beachfront property",
//   //   price: 200,
//   //   location: "Miami Beach",
//   //   geometry: {
//   //     type: "Point",
//   //     coordinates: [-80.1918, 25.7617], // [longitude, latitude]
//   //   },
//   // });
//   // console.log(newListing);

//   // // const newListing = new listing({
//   //   ...req.body.listing,
//   //   image: { url: req.file.path, filename: req.file.filename },
//   //   owner: req.user._id,
//   //   geometry,
//   // });

//   // await newListing.save();
//   res.redirect("/listings/new");
// };

module.exports.createNewListings = async (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Send valid data for listing"));
  }

  const apiKey = process.env.MAP_TOKEN;
  const location = `${req.body.listing.country}, ${req.body.listing.location}`;
  console.log(location);
  const locationQuery = location;

  try {
    const response = await fetch(
      `https://graphhopper.com/api/1/geocode?q=${locationQuery}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.hits && data.hits.length > 0) {
      const place = data.hits[0];
      // newListing.geometry = {
      //   type: "Point",
      //   coordinates: [place.point.lng, place.point.lat], // longitude, latitude order
      // };
      console.log(`latitude ${place.point.lat} , longitute ${place.point.lng}`);
    } else {
      console.log("No results found");
      // You may want to handle this case (e.g., send error response or assign a default value)
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  let newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  console.log("Saved listing:", newListing);
  // newListing.geometry = data.hits[0];
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");

  // Redirect or send JSON confirmation (choose one)
  // res.status(201).json({ message: "Listing created", listing: newListing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id);
  if (!list) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

module.exports.updateListings = async (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Send valid data for listing"));
  }
  const { id } = req.params;
  let list = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    list.image = { url, filename };
    await list.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
