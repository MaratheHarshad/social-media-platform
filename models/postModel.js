const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./userModel");

const postsSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdTime: {
    type: String,
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // reference to the User model
});

module.exports = mongoose.model("Post", postsSchema);
