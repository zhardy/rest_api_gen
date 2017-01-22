var express = require('express');

var router = express.Router();

router.get('/Content', function(req, res) { 
	var Content = GetAllContent();
	res.json({info: Content})
}); 

router.get('/Content', function(req, res) { 
	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Description;
	if(req.body.Description){
		Description = req.body.Description;
	}

	var  Content = GetContent([ContentID, Description]);
	res.json({info: Content})
}); 

router.post('/Content', function(req, res) { 
	var ContentID = req.body.ContentID;
	var Description = req.body.Description;
	var ContentID = CreateContent([ContentID, Description]);
	res.json({info: ContentID})
}); 

router.get('/Content/:ContentID', function(req, res) { 
	var ContentID = req.param.ContentID;
	var Content = GetContentByContentID(ContentID);
	res.json({info: Content});
}); 



router.put('/Content/:ContentID', function(req, res) { 
	var  ContentID = req.param.ContentID;
	var Description;
	if(req.body.Description){
		Description = req.body.Description;
	}

	var success = UpdateContent([Description]);
	res.json({info: success});
}); 



router.patch('/Content/:ContentID', function(req, res) { 
	var  ContentID = req.param.ContentID;
	var ContentID = req.body.ContentID;
	var Description = req.body.Description;
	var success = UpdateContent([Description]);
	res.json({info: success});
}); 



module.exports = router;