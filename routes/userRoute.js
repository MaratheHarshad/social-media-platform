const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/authenticate", userController.authenticate);
router.get("/follow/id", userController.followUser);

module.exports = router;
