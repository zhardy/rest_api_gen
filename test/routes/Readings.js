var express = require('express');

var router = express.Router();

router.get('/All', function(req, res) { 
	var Readings = GetAllReadings();
	res.json({info: Readings})
}); 

router.get('/', function(req, res) { 
	var ReadingsID;
	if(req.body.ReadingsID){
		ReadingsID = req.body.ReadingsID;
	}

	var ReadingDate;
	if(req.body.ReadingDate){
		ReadingDate = req.body.ReadingDate;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var  Reading = GetReading([ReadingsID, ReadingDate, WriterID]);
	res.json({info: Reading})
}); 

router.post('/', function(req, res) { 
	var ReadingsID = req.body.ReadingsID;
	var ReadingDate = req.body.ReadingDate;
	var WriterID = req.body.WriterID;
	var ReadingsID = CreateReading([ReadingsID, ReadingDate, WriterID]);
	res.json({info: ReadingsID})
}); 

router.get('/Writer', function(req, res) { 
	var ReadingsID;
	if(req.body.ReadingsID){
		ReadingsID = req.body.ReadingsID;
	}

	var ReadingDate;
	if(req.body.ReadingDate){
		ReadingDate = req.body.ReadingDate;
	}

	var Writer = GetWriterByReading([ReadingsID, ReadingDate]);
	res.json({info: Writer});
}); 

router.get('/:ReadingsID', function(req, res) { 
	var ReadingsID = req.param.ReadingsID;
	var Reading = GetReadingByReadingsID(ReadingsID);
	res.json({info: Reading});
}); 



router.put('/:ReadingsID', function(req, res) { 
	var  ReadingsID = req.param.ReadingsID;
	var ReadingDate;
	if(req.body.ReadingDate){
		ReadingDate = req.body.ReadingDate;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var success = UpdateReading([ReadingDate, WriterID]);
	res.json({info: success});
}); 



router.patch('/:ReadingsID', function(req, res) { 
	var  ReadingsID = req.param.ReadingsID;
	var ReadingsID = req.body.ReadingsID;
	var ReadingDate = req.body.ReadingDate;
	var WriterID = req.body.WriterID;
	var success = UpdateReading([ReadingDate, WriterID]);
	res.json({info: success});
}); 



module.exports = router;