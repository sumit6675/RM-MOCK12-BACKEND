const mongoose = require("mongoose");
const calculateSchema = mongoose.Schema({
    email:{ type: String, require: true },
    TotalInvestmentAmount: { type: String, require: true },
    TotalInterestGained: { type: String, require: true },
    TotalMaturityValue : { type: String, require: true },
});

const CalculateModel=mongoose.model("calculate",calculateSchema)
module.exports={
    CalculateModel
}