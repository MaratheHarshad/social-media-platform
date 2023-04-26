const { validatePost } = require("../authentication/postValidation");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// - POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.

exports.unlikePost = async (req, res) => {
  try {
    // access the current post
    const post = await Post.findById({ _id: req.params.id });

    // if post does not exist
    if (!post) {
      return res.status(404).send({ message: "post does not exist" });
    }

    // unlike only if the user previously had like the post
    if (post.likes.includes(req.user._id)) {
      post.likes.remove(req.user._id);
      await post.save();

      return res.status(200).send({
        message: "unlike the post successfully with id:" + req.params.id,
      });
    } else {
      return res.status(200).send({ message: "User Haven't like the post" });
    }
  } catch (error) {
    return res.status(400).send({ message: "incorrect post id" });
  }
};

// - POST /api/like/{id} would like the post with {id} by the authenticated user.

exports.likePost = async (req, res) => {
  try {
    // access the current post

    const post = await Post.findById({ _id: req.params.id });

    // if post does not exist
    if (!post) {
      return res.status(404).send({ message: "post does not exist" });
    }

    // if user already would have liked the post, then don't like
    // return 200 already like
    if (post.likes.includes(req.user._id)) {
      return res.status(200).send({ message: "Already like the post" });
    } else {
      // else
      // add the current user._id in likes list of post
      // return 200 liked successfully
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).send({
        message: "like the post successfully with id:" + req.params.id,
      });
    }
  } catch (error) {
    return res.status(400).send({ message: "incorrect post id" });
  }
};

// - DELETE api/posts/{id} would delete post with {id} created by the authenticated user.

exports.deletePost = async (req, res) => {
  // delete the post only and only if authenticated user created the post

  const user = await User.findById({ _id: req.user._id });

  const post = await Post.findById({ _id: req.params.id });

  // if post does not exist
  if (!post) {
    return res.status(404).send({ message: "post does not exist" });
  }

  // if authenticated user not created the post
  if (!(post.author.toString() === user._id.toString())) {
    return res.status(404).send({ message: "access denied" });
  } else {
    // delete the post

    await Post.deleteOne({ _id: post._id });

    // remoe the post from user posts

    user.posts.remove(post._id);
    await user.save();

    return res
      .status(200)
      .send({ message: "post deleted with id:" + post._id });
  }
};

// - POST api/posts/ would add a new post created by the authenticated user.
// - Input: Title, Description
// - RETURN: Post-ID, Title, Description, Created Time(UTC).
exports.posts = async (req, res) => {
  //   validate the post data
  const { error } = await validatePost(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const user = await User.findOne({ _id: req.user._id });

  try {
    //   // create new post object
    const post = await createPost(req);
    // insert new post in database

    const newPost = await Post.create(post);

    user.posts.push(newPost._id);
    await user.save();

    return res.status(201).send({
      PostID: newPost._id,
      Title: newPost.title,
      Description: newPost.description,
      CreatedTime: newPost.createdTime,
    });
  } catch (error) {
    return res.status(500).send({ message: "internal server error" });
  }
};

const createPost = async (req) => {
  const { title, description } = req.body;
  const { _id } = req.user;

  return {
    author: _id,
    title: title,
    description: description,
    createdTime: new Date().toUTCString(),
  };
};
