require("dotenv").config();

// connect to the database
require("./database/db.js");
const express = require("express");

// importing the routes

const userRoute = require("./routes/userRoute");

const PORT = 3000;

// creating instance of express
const app = express();

// middleware function
// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api", userRoute);

// home route of api
app.get("/", (req, res) => {
  res.send({
    message: "API is working for Backend Assignment of Reunion",
  });
});

// app started on listening on this port
app.listen(PORT || process.env.PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
