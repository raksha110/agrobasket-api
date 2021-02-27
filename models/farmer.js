const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  address: { type: String, required: [true, "adress is required"] },
  phoneno : { type: String, required: [true, "Phone number is required"] },
  username : { type: String, required: [true, "Username is required"] },
  password : { type: String, required: [true, "Password is required"] },
  
});

const myfarmer = (module.exports = mongoose.model("Farmer", farmerSchema));