var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Readings = db.GetAllReadings().then(function(success){
	res.json({success:true,info: Readings})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
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

	var  Reading = db.GetReading([ReadingsID, ReadingDate, WriterID]).then(function(success){
	res.json({success:true,info: Reading})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var ReadingsID = req.body.ReadingsID;
	var ReadingDate = req.body.ReadingDate;
	var WriterID = req.body.WriterID;
	var ReadingsID = db.CreateReading([ReadingsID, ReadingDate, WriterID]).then(function(success){
	res.json({success:true,info: ReadingsID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
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

	var Writer = db.GetWriterByReading([ReadingsID, ReadingDate]).then(function(success){
		res.json({success:true,info: Writer});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:ReadingsID', function(req, res) { 
	var ReadingsID = req.param.ReadingsID;
	var Reading = GetReadingByReadingsID(ReadingsID).then(function(success){
		res.json({success:true,info: Reading});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
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

	var success = UpdateReading([ReadingDate, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:ReadingsID', function(req, res) { 
	var  ReadingsID = req.param.ReadingsID;
	var ReadingsID = req.body.ReadingsID;
	var ReadingDate = req.body.ReadingDate;
	var WriterID = req.body.WriterID;
	var success = UpdateReading([ReadingDate, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;