const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  address: { type: String, required: [true, "adress is required"] },
  founder: { type: String, required: [true, "founder name is required"] },
  emailid : { type: String, required: [true, "Email id is required"] },
  phoneno : { type: String, required: [true, "Phone number is required"] },
  structure : { type: String, required: [true, "Structure is required"] },
  avgturnover : { type: String, required: [true, "Turnover is required"] },
  password : { type: String, required: [true, "Password is required"] },
  
});

const mycompany = (module.exports = mongoose.model("Company", companySchema));