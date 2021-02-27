const mongoose = require("mongoose");

const cropCompanySchema = new mongoose.Schema({
  company: {type:  mongoose.Types.ObjectId, required: [true, "Id is required"] },
  name: { type: String, required: [true, "Name is required"] },
  cropname:{ type: String, required: [true, "Crop is required"] },
  totalproduce:{ type: String, required: [true, "Total Produce is required"] },
  price: { type: String, required: [true, "Price is required"] },
  startdate:{ type: String, required: [true, "start date is required"] },
  enddate:{ type: String, required: [true, "end date is required"] },
  status:{ type: String, required: [true, "Status is required"] },
  farmer: {type:  mongoose.Types.ObjectId},

});

const mycropCompany = (module.exports = mongoose.model("cropCompany", cropCompanySchema));