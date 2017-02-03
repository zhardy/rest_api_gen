var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Content = db.GetAllContent().then(function(success){
	res.json({success:true,info: Content})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Description;
	if(req.body.Description){
		Description = req.body.Description;
	}

	var  Content = db.GetContent([ContentID, Description]).then(function(success){
	res.json({success:true,info: Content})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var ContentID = req.body.ContentID;
	var Description = req.body.Description;
	var ContentID = db.CreateContent([ContentID, Description]).then(function(success){
	res.json({success:true,info: ContentID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:ContentID', function(req, res) { 
	var ContentID = req.param.ContentID;
	var Content = GetContentByContentID(ContentID).then(function(success){
		res.json({success:true,info: Content});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:ContentID', function(req, res) { 
	var  ContentID = req.param.ContentID;
	var Description;
	if(req.body.Description){
		Description = req.body.Description;
	}

	var success = UpdateContent([Description]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:ContentID', function(req, res) { 
	var  ContentID = req.param.ContentID;
	var ContentID = req.body.ContentID;
	var Description = req.body.Description;
	var success = UpdateContent([Description]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;