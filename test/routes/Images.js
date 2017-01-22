var express = require('express');

var router = express.Router();

router.get('/Images', function(req, res) { 
	var Images = GetAllImages();
	res.json({info: Images})
}); 

router.get('/Image', function(req, res) { 
	var ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var ImagePath;
	if(req.body.ImagePath){
		ImagePath = req.body.ImagePath;
	}

	var  Image = GetImage([ImageID, ImagePath]);
	res.json({info: Image})
}); 

router.post('/Image', function(req, res) { 
	var ImageID = req.body.ImageID;
	var ImagePath = req.body.ImagePath;
	var ImageID = CreateImage([ImageID, ImagePath]);
	res.json({info: ImageID})
}); 

router.get('/Image/:ImageID', function(req, res) { 
	var ImageID = req.param.ImageID;
	var Image = GetImageByImageID(ImageID);
	res.json({info: Image});
}); 



router.put('/Image/:ImageID', function(req, res) { 
	var  ImageID = req.param.ImageID;
	var ImagePath;
	if(req.body.ImagePath){
		ImagePath = req.body.ImagePath;
	}

	var success = UpdateImage([ImagePath]);
	res.json({info: success});
}); 



router.patch('/Image/:ImageID', function(req, res) { 
	var  ImageID = req.param.ImageID;
	var ImageID = req.body.ImageID;
	var ImagePath = req.body.ImagePath;
	var success = UpdateImage([ImagePath]);
	res.json({info: success});
}); 



module.exports = router;