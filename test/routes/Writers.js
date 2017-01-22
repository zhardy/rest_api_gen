var express = require('express');

var router = express.Router();

router.get('/Writers', function(req, res) { 
	var Writers = GetAllWriters();
	res.json({info: Writers})
}); 

router.get('/Writer', function(req, res) { 
	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var WriterName;
	if(req.body.WriterName){
		WriterName = req.body.WriterName;
	}

	var WriterType;
	if(req.body.WriterType){
		WriterType = req.body.WriterType;
	}

	var StaffingType;
	if(req.body.StaffingType){
		StaffingType = req.body.StaffingType;
	}

	var ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var  Writer = GetWriter([WriterID, WriterName, WriterType, StaffingType, ImageID, ContentID]);
	res.json({info: Writer})
}); 

router.post('/Writer', function(req, res) { 
	var WriterID = req.body.WriterID;
	var WriterName = req.body.WriterName;
	var WriterType = req.body.WriterType;
	var StaffingType = req.body.StaffingType;
	var ImageID = req.body.ImageID;
	var ContentID = req.body.ContentID;
	var WriterID = CreateWriter([WriterID, WriterName, WriterType, StaffingType, ImageID, ContentID]);
	res.json({info: WriterID})
}); 

router.get('/Writer/Image', function(req, res) { 
	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var WriterName;
	if(req.body.WriterName){
		WriterName = req.body.WriterName;
	}

	var WriterType;
	if(req.body.WriterType){
		WriterType = req.body.WriterType;
	}

	var StaffingType;
	if(req.body.StaffingType){
		StaffingType = req.body.StaffingType;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Image = GetImageByWriter([WriterID, WriterName, WriterType, StaffingType, ContentID]);
	res.json({info: Image});
}); 

router.get('/Writer/Content', function(req, res) { 
	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var WriterName;
	if(req.body.WriterName){
		WriterName = req.body.WriterName;
	}

	var WriterType;
	if(req.body.WriterType){
		WriterType = req.body.WriterType;
	}

	var StaffingType;
	if(req.body.StaffingType){
		StaffingType = req.body.StaffingType;
	}

	var ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var Content = GetContentByWriter([WriterID, WriterName, WriterType, StaffingType, ImageID]);
	res.json({info: Content});
}); 

router.get('/Writer/:WriterID', function(req, res) { 
	var WriterID = req.param.WriterID;
	var Writer = GetWriterByWriterID(WriterID);
	res.json({info: Writer});
}); 



router.put('/Writer/:WriterID', function(req, res) { 
	var  WriterID = req.param.WriterID;
	var WriterName;
	if(req.body.WriterName){
		WriterName = req.body.WriterName;
	}

	var WriterType;
	if(req.body.WriterType){
		WriterType = req.body.WriterType;
	}

	var StaffingType;
	if(req.body.StaffingType){
		StaffingType = req.body.StaffingType;
	}

	var ImageID;
	if(req.body.ImageID){
		ImageID = req.body.ImageID;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var success = UpdateWriter([WriterName, WriterType, StaffingType, ImageID, ContentID]);
	res.json({info: success});
}); 



router.patch('/Writer/:WriterID', function(req, res) { 
	var  WriterID = req.param.WriterID;
	var WriterID = req.body.WriterID;
	var WriterName = req.body.WriterName;
	var WriterType = req.body.WriterType;
	var StaffingType = req.body.StaffingType;
	var ImageID = req.body.ImageID;
	var ContentID = req.body.ContentID;
	var success = UpdateWriter([WriterName, WriterType, StaffingType, ImageID, ContentID]);
	res.json({info: success});
}); 



module.exports = router;