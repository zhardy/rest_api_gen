var express = require('express');

var router = express.Router();

router.get('/All', function(req, res) { 
	var Workshops = GetAllWorkshops();
	res.json({info: Workshops})
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

	var  Workshop = GetWorkshop([WorkshopID, WorkshopName, ContentID, WriterID]);
	res.json({info: Workshop})
}); 

router.post('/', function(req, res) { 
	var WorkshopID = req.body.WorkshopID;
	var WorkshopName = req.body.WorkshopName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var WorkshopID = CreateWorkshop([WorkshopID, WorkshopName, ContentID, WriterID]);
	res.json({info: WorkshopID})
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

	var Content = GetContentByWorkshop([WorkshopID, WorkshopName, WriterID]);
	res.json({info: Content});
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

	var Writer = GetWriterByWorkshop([WorkshopID, WorkshopName, ContentID]);
	res.json({info: Writer});
}); 

router.get('/:WorkshopID', function(req, res) { 
	var WorkshopID = req.param.WorkshopID;
	var Workshop = GetWorkshopByWorkshopID(WorkshopID);
	res.json({info: Workshop});
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

	var success = UpdateWorkshop([WorkshopName, ContentID, WriterID]);
	res.json({info: success});
}); 



router.patch('/:WorkshopID', function(req, res) { 
	var  WorkshopID = req.param.WorkshopID;
	var WorkshopID = req.body.WorkshopID;
	var WorkshopName = req.body.WorkshopName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var success = UpdateWorkshop([WorkshopName, ContentID, WriterID]);
	res.json({info: success});
}); 



module.exports = router;