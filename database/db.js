const mongoose = require("mongoose");

const database = main()
  .then(() => console.log("successfully connected to database"))
  .catch((err) => console.log(err));

async function main() {
  return await mongoose.connect("mongodb://127.0.0.1:27017/assignmentDB");
}

module.exports = database;
