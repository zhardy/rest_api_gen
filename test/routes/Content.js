var express = require('express');

var router = express.Router();

router.get('/Content', function(req, res) { 
	var  ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var  Description;
	if(req.body.Description){
		Description = req.body.Description;
	}

	var  Content = GetContent([ContentID, Description]);
	res.json({info: Content})
}); 

router.get('/Content/:ContentID', function(req, res) { 
	var  ContentID = req.param.ContentID;
	var  Content = GetContentByContentID(ContentID);
	res.json({info: Content});
}); 



module.exports = router;