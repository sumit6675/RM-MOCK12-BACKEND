require("dotenv").config();
const express = require("express");
const userRoute = express.Router();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { RegisterModel } = require("../Models/users.models");

userRoute.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (name && email && password) {
      const CheckEmail = await RegisterModel.find({ email: email });
      if (CheckEmail.length > 0) {
        res.send("email alredy exist");
      } else {
        bcrypt.hash(password, 8, async (err, hash) => {
          if (err) {
            console.log("err", err);
            res.send(err);
          }
          const user = new RegisterModel({
            name,
            email,
            password: hash,
          });
          await user.save();
          res.send("Registerd");
        });
      }
    } else {
      res.send("please fill all details");
    }
  } catch (err) {
    console.log("err", err);
    res.send(err);
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await RegisterModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, function (err, result) {
        if (result) {
          const token = jwt.sign(
            { userID: user[0]._id },
            process.env.privateKey,
            { expiresIn: "1h" }
          );
          res.send({
            msg: "Login Sucess",
            Token: token,
            email: user[0].email,
            name: user[0].name,
          });
        } else {
          res.send("wrong password");
        }
      });
    } else {
      res.send("wrong email");
    }
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = {
  userRoute,
};
