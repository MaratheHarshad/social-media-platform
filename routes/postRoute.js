const { verifyJWT } = require("../authentication/verifyToken");
const postController = require("../controllers/postController");

const router = require("express").Router();

router.post("/posts", verifyJWT);

module.exports = router;
