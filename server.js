const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const db = require("./config/keys").mongoURI;

const app = express();
const port = process.env.PORT || 5000;

//MongoDB Connection
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//Configure PORT
app.listen(port, () => console.log(`Server running on port ${port}`));

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport Config
app.use(passport.initialize());
require("./config/passport")(passport);

//Routes
app.get("/", (req, res) => res.send("Hello"));
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
