const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  mongoose.connect(mongo_url);
}

main()
  .then((res) => console.log("connect to db init"))
  .catch((err) => console.log("init not connected"));

const initdb = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68f6fab2c29fa1f619009026",
  }));
  await listing.insertMany(initData.data);
  console.log("data is inserted");
};

initdb();
