const User = require("../models/userModel");
const { createToken } = require("../authentication/getToken");
const { validateUser } = require("../authentication/userValidation");

// - GET /api/user should authenticate the request and return the respective user profile.
//     - RETURN: User Name, number of followers & followings.

exports.getUser = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const followingCount = user.following.length;
  const followersCount = user.followers.length;

  return res.status(200).send({
    name: user.name,
    followers: followersCount,
    following: followingCount,
  });
};

// POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
exports.unfollowUser = async (req, res) => {
  // get the current authenticated user
  const authenticatedUser = await User.findById(req.user._id);
  const tobeunFollowUser = await User.findById(req.params.id);

  // authenticated user is unfollowing himself
  if (req.user._id === req.params.id) {
    return res.status(400).send({ message: `Invalid request` });
  }

  // handle cases like

  // user with id does not exist
  if (!tobeunFollowUser) {
    return res
      .status(404)
      .send({ message: `User with id:${req.params.id} does not exist` });
  }

  // unfollow only if authenticated person is following the user

  if (authenticatedUser.following.includes(tobeunFollowUser._id)) {
    authenticatedUser.following.remove(tobeunFollowUser._id);
    await authenticatedUser.save();

    tobeunFollowUser.followers.remove(authenticatedUser._id);
    await tobeunFollowUser.save();

    return res.status(200).send({
      message: "UnFollowing to the user with id: " + tobeunFollowUser._id,
    });
  } else {
    return res.status(200).send({ message: `Already UnFollowing` });
  }
};

// end point where authenticated user follows the user with provided user id
// POST /api/follow/{id} authenticated user would follow user with {id}

exports.followUser = async (req, res) => {  
  // get the current authenticated user
  const authenticatedUser = await User.findById(req.user._id);
  const tobeFollowUser = await User.findById(req.params.id);

  // handle cases like

  // user with id does not exist
  if (!tobeFollowUser) {
    return res
      .status(404)
      .send({ message: `User with id:${req.params.id} does not exist` });
  }

  // console.log(authenticatedUser);
  // console.log(tobeFollowUser);

  // authenticated user is following himself
  if (req.user._id === req.params.id) {
    return res.status(400).send({ message: `Invalid request` });
  }

  // console.log(authenticatedUser);
  // console.log(tobeFollowUser);

  // if authenticated user alredy following the same user
  if (authenticatedUser.following.includes(tobeFollowUser._id)) {
    return res.status(200).send({ message: `Already following` });
  }
  // else update both the documents

  authenticatedUser.following.push(tobeFollowUser._id);
  await authenticatedUser.save();

  tobeFollowUser.followers.push(authenticatedUser._id);
  await tobeFollowUser.save();

  return res.status(200).send({
    message: "Following to the user with id: " + tobeFollowUser._id,
  });
};

// authenticate the user here and return the validation token
exports.authenticate = async (req, res) => {
  let { email, password } = req.body;

  //   await is important we need to wait till the Promise is resolved otherwise it provides undefined values
  const { error } = await validateUser(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const user = await User.findOne({ email: email });

  //   if user exist
  if (user) {
    if (user.password !== password) {
      return res.status(401).send({ error: "password is incorrect" });
    } else {
      // create the token and give it to the user
      const token = await createToken(user);

      return res.status(200).header({ token: token }).send({ token: token });
    }
  } else {
    // if user not exist, create a new one

    const user = await createUserObject(req.body);

    const newUser = await User.create(user);

    const token = await createToken(newUser);

    return res.status(201).header({ token: token }).send({ token: token });
  }
};

// create user javascript object
const createUserObject = async (data) => {
  //   considering that if name is not specified in the body default name is assign

  let { name, email, password } = data;

  if (!name) {
    name = "Name undefined";
  }

  const newUser = {
    name: name,
    email: email,
    password: password,
  };

  return newUser;
};
