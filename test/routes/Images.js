var express = require('express');

var router = express.Router();

router.get('/Image', function(req, res) { 
	var  ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var  ImagePath;
	if(req.body.ImagePath){
		ImagePath = req.body.ImagePath;
	}

	var  Image = GetImage([ImageID, ImagePath]);
	res.json({info: Image})
}); 

router.get('/Image/:ImageID', function(req, res) { 
	var  ImageID = req.param.ImageID;
	var  Image = GetImageByImageID(ImageID);
	res.json({info: Image});
}); 



module.exports = router;