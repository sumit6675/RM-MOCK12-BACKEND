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
        res.status(401).json({msg:"email alredy exist"});
      } else {
        bcrypt.hash(password, 8, async (err, hash) => {
          if (err) {
            console.log("err", err);
            res.status(401).json({msg:err});
          }
          const user = new RegisterModel({
            name,
            email,
            password: hash,
          });
          await user.save();
          res.status(201).json({msg:"Registerd"});
        });
      }
    } else {
      res.status(401).json({msg:"please fill all details"});
    }
  } catch (err) {
    console.log("err", err);
    res.status(401).json({msg:err});
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
          res.status(201).json({
            msg: "Login Sucess",
            Token: token,
            email: user[0].email,
            name: user[0].name,
          });
        } else {
          res.status(401).json({msg:"wrong password"});
        }
      });
    } else {
      res.status(401).json({msg:"wrong email"});
    }
  } catch (err) {
    console.log("err", err);
    res.status(401).json({msg:err});
  }
});

userRoute.get("/getProfile",async(req,res)=>{
    const {email}=req.query
    try{
      if(email){
        const data=await RegisterModel.find({email})
        res.status(201).json({data:data});
      }else{
        res.status(401).json({msg:"please Login"});
      }
    }catch(err){
      console.log("err", err);
      res.status(401).json({msg:err});
    }
})

module.exports = {
  userRoute,
};
