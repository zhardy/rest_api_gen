var express = require('express');

var router = express.Router();

router.get('/Users', function(req, res) { 
	var Users = GetAllUsers();
	res.json({info: Users})
}); 

router.get('/User', function(req, res) { 
	var UserID;
	if(req.body.UserID){
		UserID = req.body.UserID;
	}

	var Username;
	if(req.body.Username){
		Username = req.body.Username;
	}

	var  User = GetUser([UserID, Username]);
	res.json({info: User})
}); 

router.post('/User', function(req, res) { 
	var UserID = req.body.UserID;
	var Username = req.body.Username;
	var UserID = CreateUser([UserID, Username]);
	res.json({info: UserID})
}); 

router.get('/User/:UserID', function(req, res) { 
	var UserID = req.param.UserID;
	var User = GetUserByUserID(UserID);
	res.json({info: User});
}); 



router.put('/User/:UserID', function(req, res) { 
	var  UserID = req.param.UserID;
	var Username;
	if(req.body.Username){
		Username = req.body.Username;
	}

	var success = UpdateUser([Username]);
	res.json({info: success});
}); 



router.patch('/User/:UserID', function(req, res) { 
	var  UserID = req.param.UserID;
	var UserID = req.body.UserID;
	var Username = req.body.Username;
	var success = UpdateUser([Username]);
	res.json({info: success});
}); 



module.exports = router;