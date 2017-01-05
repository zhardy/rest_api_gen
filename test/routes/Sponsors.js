var express = require('express');

var router = express.Router();

router.get('/Sponsor', function(req, res) { 
	var  SponsorID;
	if(req.body.SponsorID){
		SponsorID = req.body.SponsorID;
	}

	var  SponsorName;
	if(req.body.SponsorName){
		SponsorName = req.body.SponsorName;
	}

	var  Link;
	if(req.body.Link){
		Link = req.body.Link;
	}

	var  ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var  Sponsor = GetSponsor([SponsorID, SponsorName, Link, ContentID]);
	res.json({info: Sponsor})
}); 

router.get('/Sponsor/:SponsorID', function(req, res) { 
	var  SponsorID = req.param.SponsorID;
	var  Sponsor = GetSponsorBySponsorID(SponsorID);
	res.json({info: Sponsor});
}); 



router.get('/Sponsor/Content', function(req, res) { 
	var  SponsorID;
	if(req.body.SponsorID){
		SponsorID = req.body.SponsorID;
	}

	var  SponsorName;
	if(req.body.SponsorName){
		SponsorName = req.body.SponsorName;
	}

	var  Link;
	if(req.body.Link){
		Link = req.body.Link;
	}

	var Content = GetContentBySponsor([SponsorID, SponsorName, Link]);
	res.json({info: Content});
}); 

module.exports = router;