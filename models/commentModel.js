const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./userModel");

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
