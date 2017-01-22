var express = require('express');

var router = express.Router();

router.get('/Passwords', function(req, res) { 
	var Passwords = GetAllPasswords();
	res.json({info: Passwords})
}); 

router.get('/Password', function(req, res) { 
	var PasswordID;
	if(req.body.PasswordID){
		PasswordID = req.body.PasswordID;
	}

	var Password;
	if(req.body.Password){
		Password = req.body.Password;
	}

	var  Password = GetPassword([PasswordID, Password]);
	res.json({info: Password})
}); 

router.post('/Password', function(req, res) { 
	var PasswordID = req.body.PasswordID;
	var Password = req.body.Password;
	var PasswordID = CreatePassword([PasswordID, Password]);
	res.json({info: PasswordID})
}); 

router.get('/Password/:PasswordID', function(req, res) { 
	var PasswordID = req.param.PasswordID;
	var Password = GetPasswordByPasswordID(PasswordID);
	res.json({info: Password});
}); 



router.put('/Password/:PasswordID', function(req, res) { 
	var  PasswordID = req.param.PasswordID;
	var Password;
	if(req.body.Password){
		Password = req.body.Password;
	}

	var success = UpdatePassword([Password]);
	res.json({info: success});
}); 



router.patch('/Password/:PasswordID', function(req, res) { 
	var  PasswordID = req.param.PasswordID;
	var PasswordID = req.body.PasswordID;
	var Password = req.body.Password;
	var success = UpdatePassword([Password]);
	res.json({info: success});
}); 



module.exports = router;