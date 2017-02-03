var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Passwords = db.GetAllPasswords().then(function(success){
	res.json({success:true,info: Passwords})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var PasswordID;
	if(req.body.PasswordID){
		PasswordID = req.body.PasswordID;
	}

	var Password;
	if(req.body.Password){
		Password = req.body.Password;
	}

	var  Password = db.GetPassword([PasswordID, Password]).then(function(success){
	res.json({success:true,info: Password})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var PasswordID = req.body.PasswordID;
	var Password = req.body.Password;
	var PasswordID = db.CreatePassword([PasswordID, Password]).then(function(success){
	res.json({success:true,info: PasswordID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:PasswordID', function(req, res) { 
	var PasswordID = req.param.PasswordID;
	var Password = GetPasswordByPasswordID(PasswordID).then(function(success){
		res.json({success:true,info: Password});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:PasswordID', function(req, res) { 
	var  PasswordID = req.param.PasswordID;
	var Password;
	if(req.body.Password){
		Password = req.body.Password;
	}

	var success = UpdatePassword([Password]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:PasswordID', function(req, res) { 
	var  PasswordID = req.param.PasswordID;
	var PasswordID = req.body.PasswordID;
	var Password = req.body.Password;
	var success = UpdatePassword([Password]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;