var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Users = db.GetAllUsers().then(function(success){
	res.json({success:true,info: Users})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var UserID;
	if(req.body.UserID){
		UserID = req.body.UserID;
	}

	var Username;
	if(req.body.Username){
		Username = req.body.Username;
	}

	var  User = db.GetUser([UserID, Username]).then(function(success){
	res.json({success:true,info: User})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var UserID = req.body.UserID;
	var Username = req.body.Username;
	var UserID = db.CreateUser([UserID, Username]).then(function(success){
	res.json({success:true,info: UserID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:UserID', function(req, res) { 
	var UserID = req.param.UserID;
	var User = GetUserByUserID(UserID).then(function(success){
		res.json({success:true,info: User});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:UserID', function(req, res) { 
	var  UserID = req.param.UserID;
	var Username;
	if(req.body.Username){
		Username = req.body.Username;
	}

	var success = UpdateUser([Username]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:UserID', function(req, res) { 
	var  UserID = req.param.UserID;
	var UserID = req.body.UserID;
	var Username = req.body.Username;
	var success = UpdateUser([Username]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;