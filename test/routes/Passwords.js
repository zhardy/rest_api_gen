var express = require('express');

var router = express.Router();

router.get('/Password', function(req, res) { 
	var  PasswordID;
	if(req.body.PasswordID){
		PasswordID = req.body.PasswordID;
	}

	var  Password;
	if(req.body.Password){
		Password = req.body.Password;
	}

	var  Password = GetPassword([PasswordID, Password]);
	res.json({info: Password})
}); 

router.get('/Password/:PasswordID', function(req, res) { 
	var  PasswordID = req.param.PasswordID;
	var  Password = GetPasswordByPasswordID(PasswordID);
	res.json({info: Password});
}); 



module.exports = router;