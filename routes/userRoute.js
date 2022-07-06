const userModel = require("../models/user");
const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const rounds = 4;
const jwt = require("jsonwebtoken");
const tokenSecret = "my-token-secret";

// generate token
function generateToken(user) {
    return jwt.sign(
      {
        data: user,
      },
      tokenSecret,
      { expiresIn: "24h" }
    );
  }
//get all users
userRoute.get("/", async (req, res) => {
  try {
    var response = await userModel.find();
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//create user
userRoute.post("/", async (req, res) => {
    bcrypt.hash(req.body.password, rounds, (error, hash) => {
      if (error) {
        res.status(500).json({ error: "there was an error" });
      } else {
        userModel.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            res.json({ status: false, message: "User with that email exists" });
          } else {
            const newuser = new userModel({
              name: req.body.name,
              email: req.body.email,
              phonenumber: req.body.phonenumber,
              password: hash,
            });
            newuser
              .save()
              .then(async (user) => {
                console.log(user);
                res
                  .status(200)
                  .json({ status: true, token: generateToken(user), body: user });
              })
              .catch((error) => {
                res.status(500).json({
                  status: false,
                  message: "The email you have entered is in use by another user",
                });
              });
          }
        });
      }
    });
  });

  //login user
  userRoute.post("/login", async (req, res) => {
    userModel
      .findOne({ email: req.body.email })
      .then((user) => {
        console.log(`my user ${user}`);
        if (!user) {
          res.status(404).json({
            status: false,
            body: "No user with that email found",
          });
        } else {
          bcrypt.compare(req.body.password, user.password, (error, match) => {
            if (error) {
              res.json({ status: false, message: error.message });
            } else if (match) {
              res
                .status(200)
                .json({ token: generateToken(user), status: true, body: user });
            } else {
              res.status(403).json({ error: "password did not match" });
            }
          });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
//get one user

userRoute.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.params.id });

    if (!user) {
      res.json({ message: "user not found" });
    } else {
      res.json({ status: true, data: user });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//update a user
userRoute.patch("/:id", async (req, res) => {
  try {
    userModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true },
      (err, data) => {
        if (data == null) {
          res.json({ status: false, message: "No user found" });
        } else {
          res.json({ status: true, body: data });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

//delete a user

userRoute.delete("/:id", async (req, res) => {
  try {
    await userModel.findByIdAndDelete({ _id: req.params.id });
    res.json({ status: true, body: "User has been deleted." });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

module.exports = userRoute;
