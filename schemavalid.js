const Joi = require("joi");
const listing = require("./models/listing");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
  }).required(),
});

// const listingJoiSchema = Joi.object({
//   title: Joi.string().required(),
//   price: Joi.number().required(),
//   description: Joi.string().optional(),
//   location: Joi.string().optional(),
//   country: Joi.string().optional(),
//   geometry: Joi.object({
//     type: Joi.string().valid("Point").required(),
//     coordinates: Joi.array().items(Joi.number()).length(2).required(),
//   }).required(),
//   // Add other fields validations here
// });

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required(),
});
