const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
const User = require("../../modals//User");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = express.Router();

//@route    GET api/users/register
//@desc     Registering user details
//@access   Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        pg: "pg", //Rating
        d: "mm" // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(newUser.password, salt))
        .then(hash => {
          newUser.password = hash;
          return newUser.save();
        })
        .then(user => res.json(user))
        .catch(err => {
          res.status(400).json({
            error: err.message
          });
        });
    }
  });
});

//@route    GET api/users/login
//@desc     Login User / Returning JWT Token
//@access   Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    res.status(400).json(errors);
  }

  //find the user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      res.status(404).json(errors);
    }

    //check Password
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        const { id, name, avatar } = user;
        if (isMatch) {
          const payload = { id, name, avatar };
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) =>
            res.json({
              success: true,
              token: "Bearer " + token
            })
          );
        } else {
          errors.password = "Password incorrect";
          res.status(400).json(errors);
        }
      })
      .catch(err => res.status(500).json({ err }));
  });
});

//@route    GET api/users/current
//@desc     Return current user
//@access   Private
router.get("/current", passport.authenticate("jwt", { session: false }), ({ user: { id, name, email } }, res) => {
  res.json({ id, name, email });
});

module.exports = router;
