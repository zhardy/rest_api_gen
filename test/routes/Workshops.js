var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Workshops = db.GetAllWorkshops().then(function(success){
	res.json({success:true,info: Workshops})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var WorkshopID;
	if(req.body.WorkshopID){
		WorkshopID = req.body.WorkshopID;
	}

	var WorkshopName;
	if(req.body.WorkshopName){
		WorkshopName = req.body.WorkshopName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var  Workshop = db.GetWorkshop([WorkshopID, WorkshopName, ContentID, WriterID]).then(function(success){
	res.json({success:true,info: Workshop})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var WorkshopID = req.body.WorkshopID;
	var WorkshopName = req.body.WorkshopName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var WorkshopID = db.CreateWorkshop([WorkshopID, WorkshopName, ContentID, WriterID]).then(function(success){
	res.json({success:true,info: WorkshopID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Content', function(req, res) { 
	var WorkshopID;
	if(req.body.WorkshopID){
		WorkshopID = req.body.WorkshopID;
	}

	var WorkshopName;
	if(req.body.WorkshopName){
		WorkshopName = req.body.WorkshopName;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var Content = db.GetContentByWorkshop([WorkshopID, WorkshopName, WriterID]).then(function(success){
		res.json({success:true,info: Content});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Writer', function(req, res) { 
	var WorkshopID;
	if(req.body.WorkshopID){
		WorkshopID = req.body.WorkshopID;
	}

	var WorkshopName;
	if(req.body.WorkshopName){
		WorkshopName = req.body.WorkshopName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Writer = db.GetWriterByWorkshop([WorkshopID, WorkshopName, ContentID]).then(function(success){
		res.json({success:true,info: Writer});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:WorkshopID', function(req, res) { 
	var WorkshopID = req.param.WorkshopID;
	var Workshop = GetWorkshopByWorkshopID(WorkshopID).then(function(success){
		res.json({success:true,info: Workshop});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:WorkshopID', function(req, res) { 
	var  WorkshopID = req.param.WorkshopID;
	var WorkshopName;
	if(req.body.WorkshopName){
		WorkshopName = req.body.WorkshopName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var success = UpdateWorkshop([WorkshopName, ContentID, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:WorkshopID', function(req, res) { 
	var  WorkshopID = req.param.WorkshopID;
	var WorkshopID = req.body.WorkshopID;
	var WorkshopName = req.body.WorkshopName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var success = UpdateWorkshop([WorkshopName, ContentID, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;