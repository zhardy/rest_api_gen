var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Writers = db.GetAllWriters().then(function(success){
	res.json({success:true,info: Writers})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
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

	var  Writer = db.GetWriter([WriterID, WriterName, WriterType, StaffingType, ImageID, ContentID]).then(function(success){
	res.json({success:true,info: Writer})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var WriterID = req.body.WriterID;
	var WriterName = req.body.WriterName;
	var WriterType = req.body.WriterType;
	var StaffingType = req.body.StaffingType;
	var ImageID = req.body.ImageID;
	var ContentID = req.body.ContentID;
	var WriterID = db.CreateWriter([WriterID, WriterName, WriterType, StaffingType, ImageID, ContentID]).then(function(success){
	res.json({success:true,info: WriterID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Image', function(req, res) { 
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

	var Image = db.GetImageByWriter([WriterID, WriterName, WriterType, StaffingType, ContentID]).then(function(success){
		res.json({success:true,info: Image});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Content', function(req, res) { 
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

	var Content = db.GetContentByWriter([WriterID, WriterName, WriterType, StaffingType, ImageID]).then(function(success){
		res.json({success:true,info: Content});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:WriterID', function(req, res) { 
	var WriterID = req.param.WriterID;
	var Writer = GetWriterByWriterID(WriterID).then(function(success){
		res.json({success:true,info: Writer});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:WriterID', function(req, res) { 
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

	var success = UpdateWriter([WriterName, WriterType, StaffingType, ImageID, ContentID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:WriterID', function(req, res) { 
	var  WriterID = req.param.WriterID;
	var WriterID = req.body.WriterID;
	var WriterName = req.body.WriterName;
	var WriterType = req.body.WriterType;
	var StaffingType = req.body.StaffingType;
	var ImageID = req.body.ImageID;
	var ContentID = req.body.ContentID;
	var success = UpdateWriter([WriterName, WriterType, StaffingType, ImageID, ContentID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;