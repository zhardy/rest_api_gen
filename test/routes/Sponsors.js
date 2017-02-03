var express = require('express');

var router = express.Router();

var db = require('../lib/dbAccess.js')

router.get('/All', function(req, res) { 
	var Sponsors = db.GetAllSponsors().then(function(success){
	res.json({success:true,info: Sponsors})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/', function(req, res) { 
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

	var  Sponsor = db.GetSponsor([SponsorID, SponsorName, Link, ContentID]).then(function(success){
	res.json({success:true,info: Sponsor})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.post('/', function(req, res) { 
	var SponsorID = req.body.SponsorID;
	var SponsorName = req.body.SponsorName;
	var Link = req.body.Link;
	var ContentID = req.body.ContentID;
	var SponsorID = db.CreateSponsor([SponsorID, SponsorName, Link, ContentID]).then(function(success){
	res.json({success:true,info: SponsorID})
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/Content', function(req, res) { 
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

	var Content = db.GetContentBySponsor([SponsorID, SponsorName, Link]).then(function(success){
		res.json({success:true,info: Content});
	},
	function(err){
			res.json({success:false, error:err.toString()});
	});
}); 

router.get('/:SponsorID', function(req, res) { 
	var SponsorID = req.param.SponsorID;
	var Sponsor = GetSponsorBySponsorID(SponsorID).then(function(success){
		res.json({success:true,info: Sponsor});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.put('/:SponsorID', function(req, res) { 
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

	var success = UpdateSponsor([SponsorName, Link, ContentID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



router.patch('/:SponsorID', function(req, res) { 
	var  SponsorID = req.param.SponsorID;
	var SponsorID = req.body.SponsorID;
	var SponsorName = req.body.SponsorName;
	var Link = req.body.Link;
	var ContentID = req.body.ContentID;
	var success = UpdateSponsor([SponsorName, Link, ContentID]).then(function(success){
		res.json({success:true,info: success});
	},
		function(err){
			res.json({success:false, error:err.toString()});
	});
}); 



module.exports = router;