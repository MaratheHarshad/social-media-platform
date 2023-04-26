const router = require("express").Router();
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

const { verifyJWT } = require("../authentication/verifyToken");

// endpoints under user controller
// all the endpoints which are come under user route

router.post("/authenticate", userController.authenticate);

router.post("/follow/:id", verifyJWT, userController.followUser);

router.post("/unfollow/:id", verifyJWT, userController.unfollowUser);

router.get("/user", verifyJWT, userController.getUser);

// endpoints under post controller
router.post("/posts", verifyJWT, postController.posts);

router.delete("/posts/:id", verifyJWT, postController.deletePost);

router.post("/like/:id", verifyJWT, postController.likePost);

router.post("/unlike/:id", verifyJWT, postController.unlikePost);

// export the express router
module.exports = router;
