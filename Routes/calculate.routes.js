require("dotenv").config();
const express = require("express");
const { CalculateModel } = require("../Models/calculate.model");
const calculateRoute = express.Router();

calculateRoute.post("/postData",async(req,res)=>{
    const {email,TotalInvestmentAmount,TotalInterestGained,TotalMaturityValue}=req.body
    try{
        const CheckEmail = await CalculateModel.find({ email: email });
        if(CheckEmail.length===0){
            const expense = new CalculateModel({
                email,
                TotalInvestmentAmount,
                TotalInterestGained,
                TotalMaturityValue
              });
              await expense.save();
              res.status(201).json({msg:"Data Saved"});
        }
    }catch(err){
        console.log("err", err);
        res.status(401).json({msg:err});
    }
})

calculateRoute.get("/getProfile",async(req,res)=>{
   const {email}=req.body
    try{
        if(email){
            const data=await CalculateModel.find({email})
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
    calculateRoute,
};
