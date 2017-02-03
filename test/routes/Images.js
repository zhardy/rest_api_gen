var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Images = db.GetAllImages().then(function(success){
	res.json({success:true,info: Images})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var ImagePath;
	if(req.body.ImagePath){
		ImagePath = req.body.ImagePath;
	}

	var  Image = db.GetImage([ImageID, ImagePath]).then(function(success){
	res.json({success:true,info: Image})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var ImageID = req.body.ImageID;
	var ImagePath = req.body.ImagePath;
	var ImageID = db.CreateImage([ImageID, ImagePath]).then(function(success){
	res.json({success:true,info: ImageID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:ImageID', function(req, res) { 
	var ImageID = req.param.ImageID;
	var Image = GetImageByImageID(ImageID).then(function(success){
		res.json({success:true,info: Image});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:ImageID', function(req, res) { 
	var  ImageID = req.param.ImageID;
	var ImagePath;
	if(req.body.ImagePath){
		ImagePath = req.body.ImagePath;
	}

	var success = UpdateImage([ImagePath]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:ImageID', function(req, res) { 
	var  ImageID = req.param.ImageID;
	var ImageID = req.body.ImageID;
	var ImagePath = req.body.ImagePath;
	var success = UpdateImage([ImagePath]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;