var express = require('express');

var router = express.Router();

router.get('/Sponsors', function(req, res) { 
	var Sponsors = GetAllSponsors();
	res.json({info: Sponsors})
}); 

router.get('/Sponsor', function(req, res) { 
	var SponsorID;
	if(req.body.SponsorID){
		SponsorID = req.body.SponsorID;
	}

	var SponsorName;
	if(req.body.SponsorName){
		SponsorName = req.body.SponsorName;
	}

	var Link;
	if(req.body.Link){
		Link = req.body.Link;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var  Sponsor = GetSponsor([SponsorID, SponsorName, Link, ContentID]);
	res.json({info: Sponsor})
}); 

router.post('/Sponsor', function(req, res) { 
	var SponsorID = req.body.SponsorID;
	var SponsorName = req.body.SponsorName;
	var Link = req.body.Link;
	var ContentID = req.body.ContentID;
	var SponsorID = CreateSponsor([SponsorID, SponsorName, Link, ContentID]);
	res.json({info: SponsorID})
}); 

router.get('/Sponsor/Content', function(req, res) { 
	var SponsorID;
	if(req.body.SponsorID){
		SponsorID = req.body.SponsorID;
	}

	var SponsorName;
	if(req.body.SponsorName){
		SponsorName = req.body.SponsorName;
	}

	var Link;
	if(req.body.Link){
		Link = req.body.Link;
	}

	var Content = GetContentBySponsor([SponsorID, SponsorName, Link]);
	res.json({info: Content});
}); 

router.get('/Sponsor/:SponsorID', function(req, res) { 
	var SponsorID = req.param.SponsorID;
	var Sponsor = GetSponsorBySponsorID(SponsorID);
	res.json({info: Sponsor});
}); 



router.put('/Sponsor/:SponsorID', function(req, res) { 
	var  SponsorID = req.param.SponsorID;
	var SponsorName;
	if(req.body.SponsorName){
		SponsorName = req.body.SponsorName;
	}

	var Link;
	if(req.body.Link){
		Link = req.body.Link;
	}

	var ContentID;
	if(req.body.ContentID){
		ContentID = req.body.ContentID;
	}

	var success = UpdateSponsor([SponsorName, Link, ContentID]);
	res.json({info: success});
}); 



router.patch('/Sponsor/:SponsorID', function(req, res) { 
	var  SponsorID = req.param.SponsorID;
	var SponsorID = req.body.SponsorID;
	var SponsorName = req.body.SponsorName;
	var Link = req.body.Link;
	var ContentID = req.body.ContentID;
	var success = UpdateSponsor([SponsorName, Link, ContentID]);
	res.json({info: success});
}); 



module.exports = router;