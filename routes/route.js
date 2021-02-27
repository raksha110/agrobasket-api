/*

All validation would happen on client side.
Password would comehash from client side.
Structureis public,private or partnerhip
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require('axios');

/*
	Making variable of the tbles.
*/
const Company = require("../models/company");
const Farmer = require("../models/farmer");
const CropToGrow = require("../models/croptobegrown");


/*
	Demo route to check if its working
*/
router.get("/",(req, res, next) => {
	res.send("Hello welcome to agri basket api");
});

/*
	THIs is use to call the prediction moel and check if the preicted crop iswanted by any company or not.
	Input is for bajara and there is no crop. Change the data to rice to see the result. 
*/

router.get("/predictCrop",(req,res,next) => {
	axios.post('https://agrobasketpreiction.herokuapp.com/predictKNeighborsRegressor', {
    soil : "Sandy Loamy Soil",
	season : "Kharif",
	month :"June",
	mintemp: "20",
	maxtemp :"30",
	soilPhMin: "7",
	soilPhMax :"8",
	minRainfall: "400",
	maxRainfall :"750"
  })
  .then(axiosRes => {
	let cropName = (axiosRes.data).toLowerCase();
	console.log(cropName);
	if(cropName != "None"){
		CropToGrow.aggregate([
		{
			$lookup:{
				from : 'companies',
				localField : 'company',
				foreignField: '_id',
	         	as: 'companydetail'
			}
		},{
			$match:{
				cropname: cropName,
				status: "Not accepted",
			}
		}
		]).exec(function(err, cp) {
	    	if(cp.length == 0){
	    		res.send("No match found for given crop");
	    	}
	    	else
	    		res.send(cp);
		});
	}
  })
  .catch(error => {
    console.error(error)
  })
});

/*
	Return all the companies information
*/

router.get("/getAllCompany",(req,res,next) => {

	Company.find({}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else{
            res.send(matched);
        }
	})

});

/*
	Return all the farmer informatoin
*/

router.get("/getAllFarmer",(req,res,next) => {

	Farmer.find({}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else{
            res.send(matched);
        }
	})

});

/*
	Adding a company
*/

router.get("/addCompany/:name/:address/:founder/:emailid/:phoneno/:structure/:avgturnover/:password",(req,res,next) => {
	let nameP = req.params['name'];
	let addressP = req.params['address'];
	let founderP = req.params['founder'];
	let emailidP = req.params['emailid'];
	let phonenoP = req.params['phoneno'];
	let structureP = req.params['structure'];
	let avgturnoverP = req.params['avgturnover'];
	let passwordP = req.params['password'];
	
	Company.find({ name : nameP}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else if(matched.length == 0){
            let newCmpany = new Company({
		        name : nameP,
				address : addressP,
				founder : founderP,
				emailid : emailidP,
				phoneno : phonenoP,
				structure : structureP,
				avgturnover : avgturnoverP,
				password : passwordP
		    });
		    newCmpany.save((err, notes)=>{
		        if(err){
		            res.json({msg: "Failed to add a company"+err})
		        }else{
		            res.json({msg: "Company Added successfully"})
		        }
		    });
        }else{
            res.send("Already the company was registered");
        }
	})	
});

/*
	Adding a farmer
*/

router.get("/addFarmer/:name/:address/:phoneno/:username/:password",(req,res,next) => {
	let nameP = req.params['name'];
	let addressP = req.params['address'];
	let phonenoP = req.params['phoneno'];
	let usernameP = req.params['username'];
	let passwordP = req.params['password'];
	
	Farmer.find({ username : usernameP}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else if(matched.length == 0){
            let newFarmer = new Farmer({
		        name : nameP,
				address : addressP,
				phoneno : phonenoP,
				username : usernameP,
				password : passwordP
		    });
		    newFarmer.save((err, notes)=>{
		        if(err){
		            res.json({msg: "Failed to add a company"+err})
		        }else{
		            res.json({msg: "Farmer Added successfully"})
		        }
		    });
        }else{
            res.send("username is already taken");
        }
	})	
});

/*
	login for a company
*/

router.get("/checkCompanyLogin/:emailid/:password" ,(req,res,next) => {
	let emailidP = req.params['emailid'];
	let passwordP = req.params['password'];
	Company.find({ emailid : emailidP}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else if(matched.length == 0){
            res.send("Email id was not registered");
        }else{
        	if(matched[0].password == passwordP)
            	res.send(matched[0]);
            else
            	res.send("password didnt matched");
        }
	})

});

/*
	Login for a farmer
*/

router.get("/checkFarmerLogin/:username/:password" ,(req,res,next) => {
	let usernameP = req.params['username'];
	let passwordP = req.params['password'];
	Farmer.find({ username : usernameP}, (err,matched) => {
		if(err){
            console.log("Herereee");
            res.status(404).json({msg: "Error  " + err})
        }else if(matched.length == 0){
            res.send("username was not registered");
        }else{
        	if(matched[0].password == passwordP)
            	res.send(matched[0]);
            else
            	res.send("password didnt matched");
        }
	})

});

/*
	If the farmer accept the proposal of the company for a crop to grow. Then it need to make status upate regularly like
	sowing,fertilization or harvestig.So this is used.

*/

router.get("/updateStatus/:cropToGrowId/:status", (req,res,next) => {
	let cropToGrowIdP = req.params['cropToGrowId'];
	let statusP = req.params['status'];
	CropToGrow.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(cropToGrowIdP) }, { status: statusP }, function(err,result) {
		if (err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

/*
	When a farmer accept the crop, the status need to change to accepted with farmer id, so this route is been used. 
*/

router.get("/updateStatusandFarmerId/:cropToGrowId/:status/:farmerId", (req,res,next) => {
	let cropToGrowIdP = req.params['cropToGrowId'];
	let statusP = req.params['status'];
	let farmerIdP = req.params['farmerId'];
	CropToGrow.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(cropToGrowIdP) }, { status: statusP, farmer: new mongoose.Types.ObjectId(farmerIdP) }, function(err,result) {
		if (err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

/*
	If company need to see what is statusf all the order it place, it can do it through this route.
	Passing company id.
*/
router.get("/getCropStatus/:companyId", (req,res,next) => {
	let companyIdP = req.params['companyId'];
	CropToGrow.aggregate([
	{
		$lookup:{
			from : 'farmers',
			localField : 'farmer',
			foreignField: '_id',
         	as: 'farmerdetail'
		}
	},{
		$match:{
			company: new mongoose.Types.ObjectId(companyIdP),
		}
	}
	]).exec(function(err, cp) {
    	res.send(cp);
	});
});

/*
	want to check manually for a crop to be grown is there or not, we would use ths route. 
*/

router.get("/getCrop/:cropname", (req,res,next) => {
	let cropP = req.params['cropname'];
	CropToGrow.aggregate([
	{
		$lookup:{
			from : 'companies',
			localField : 'company',
			foreignField: '_id',
         	as: 'companydetail'
		}
	},{
		$match:{
			cropname: cropP
		}
	}
	]).exec(function(err, cp) {
    	if(cp.length == 0){
    		res.send("No match found for given crop");
    	}
    	else
    		res.send(cp);
	});
});

/*
	Adding the crop by a company 
*/

router.get("/addCrop/:cid/:name/:cropname/:totalproduce/:price/:startdate/:enddate/:status", (req,res,next) => {

	let companyP = req.params['cid'];
	let nameP = req.params['name'];
	let cropnameP = req.params['cropname'];
	let totalproduceP = req.params['totalproduce'];
	let priceP = req.params['price'];
	let startdateP = req.params['startdate'];
	let enddateP = req.params['enddate'];
	let statusP = req.params['status'];

	let newCrop = new CropToGrow({
        company : companyP,
		name : nameP,
		cropname : cropnameP,
		totalproduce : totalproduceP,
		price : priceP,
		startdate : startdateP,
		enddate : enddateP,
		status: statusP
    });
    newCrop.save((err, notes)=>{
        if(err){
            res.json({msg: "Failed to add a company"+err})
        }else{
            res.json({msg: "Crop Added successfully"})
        }
    });
});

module.exports = router;