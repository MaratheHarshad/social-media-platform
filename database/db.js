require("dotenv").config();

const mongoose = require("mongoose");

const database = main()
  .then(() => console.log("successfully connected to database"))
  .catch((err) => console.log(err));

async function main() {
  return await mongoose.connect(process.env.MONGO_URI);
}

module.exports = database;
