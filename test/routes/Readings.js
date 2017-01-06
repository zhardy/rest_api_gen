var express = require('express');

var router = express.Router();

router.get('/Reading', function(req, res) { 
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

router.get('/Reading/Writer', function(req, res) { 
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

	var Writer = GetWriterByReading([ReadingsID, ReadingDate, WriterID]);
	res.json({info: Writer});
}); 

router.get('/Reading/:ReadingsID', function(req, res) { 
	var  ReadingsID = req.param.ReadingsID;
	var  Reading = GetReadingByReadingsID(ReadingsID);
	res.json({info: Reading});
}); 



module.exports = router;