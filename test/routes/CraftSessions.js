var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var CraftSessions = db.GetAllCraftSessions().then(function(success){
	res.json({success:true,info: CraftSessions})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
	var CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var  CraftSession = db.GetCraftSession([CraftSessionID, CraftSessionName, ContentID, WriterID]).then(function(success){
	res.json({success:true,info: CraftSession})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var CraftSessionID = req.body.CraftSessionID;
	var CraftSessionName = req.body.CraftSessionName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var CraftSessionID = db.CreateCraftSession([CraftSessionID, CraftSessionName, ContentID, WriterID]).then(function(success){
	res.json({success:true,info: CraftSessionID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Content', function(req, res) { 
	var CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var Content = db.GetContentByCraftSession([CraftSessionID, CraftSessionName, WriterID]).then(function(success){
		res.json({success:true,info: Content});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Writer', function(req, res) { 
	var CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Writer = db.GetWriterByCraftSession([CraftSessionID, CraftSessionName, ContentID]).then(function(success){
		res.json({success:true,info: Writer});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:CraftSessionID', function(req, res) { 
	var CraftSessionID = req.param.CraftSessionID;
	var CraftSession = GetCraftSessionByCraftSessionID(CraftSessionID).then(function(success){
		res.json({success:true,info: CraftSession});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:CraftSessionID', function(req, res) { 
	var  CraftSessionID = req.param.CraftSessionID;
	var CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var success = UpdateCraftSession([CraftSessionName, ContentID, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:CraftSessionID', function(req, res) { 
	var  CraftSessionID = req.param.CraftSessionID;
	var CraftSessionID = req.body.CraftSessionID;
	var CraftSessionName = req.body.CraftSessionName;
	var ContentID = req.body.ContentID;
	var WriterID = req.body.WriterID;
	var success = UpdateCraftSession([CraftSessionName, ContentID, WriterID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;