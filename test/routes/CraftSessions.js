var express = require('express');

var router = express.Router();

router.get('/CraftSession', function(req, res) { 
	var  CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var  CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var  ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var  WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var  CraftSession = GetCraftSession([CraftSessionID, CraftSessionName, ContentID, WriterID]);
	res.json({info: CraftSession})
}); 

router.get('/CraftSession/:CraftSessionID', function(req, res) { 
	var  CraftSessionID = req.param.CraftSessionID;
	var  CraftSession = GetCraftSessionByCraftSessionID(CraftSessionID);
	res.json({info: CraftSession});
}); 



router.get('/CraftSession/Content', function(req, res) { 
	var  CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var  CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var  WriterID;
	if(req.body.WriterID){
		WriterID = req.body.WriterID;
	}

	var Content = GetContentByCraftSession([CraftSessionID, CraftSessionName, WriterID]);
	res.json({info: Content});
}); 

router.get('/CraftSession/Writer', function(req, res) { 
	var  CraftSessionID;
	if(req.body.CraftSessionID){
		CraftSessionID = req.body.CraftSessionID;
	}

	var  CraftSessionName;
	if(req.body.CraftSessionName){
		CraftSessionName = req.body.CraftSessionName;
	}

	var  ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var Writer = GetWriterByCraftSession([CraftSessionID, CraftSessionName, ContentID]);
	res.json({info: Writer});
}); 

module.exports = router;