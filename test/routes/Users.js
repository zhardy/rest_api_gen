var express = require('express');

var router = express.Router();

router.get('/User', function(req, res) { 
	var  UserID;
	if(req.body.UserID){
		UserID = req.body.UserID;
	}

	var  Username;
	if(req.body.Username){
		Username = req.body.Username;
	}

	var  User = GetUser([UserID, Username]);
	res.json({info: User})
}); 

router.get('/User/:UserID', function(req, res) { 
	var  UserID = req.param.UserID;
	var  User = GetUserByUserID(UserID);
	res.json({info: User});
}); 



module.exports = router;