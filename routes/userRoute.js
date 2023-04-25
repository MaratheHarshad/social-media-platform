const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyJWT } = require("../authentication/verifyToken");

// all the endpoints which are come under user route

router.post("/authenticate", userController.authenticate);

router.post("/follow/:id", verifyJWT, userController.followUser);

router.post("/unfollow/:id", verifyJWT, userController.unfollowUser);

router.get("/user", verifyJWT, userController.getUser);

module.exports = router;
