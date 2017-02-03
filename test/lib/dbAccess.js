var pg = require('pg');
var squel = require('squel').useFlavour('postgres');
var query = require('pg-query');
var when = require('when');

query.connectionParameters = "postgres://"

function createUser(Username){
	var userInsert = squel.insert()
		.into("Users")
		.set("Username", Username)
		.returning('UserID');
	when.all([
		query(userInsert)
	]).spread(
		function(data){
			return data[0].userid;
		}
	);
}

exports.GetAllUsers = function GetUsers(){
	var usersAll = squel.select()
		.from('Users');
	when.all([
		query(usersAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createPassword(Password){
	var passwordInsert = squel.insert()
		.into("Passwords")
		.set("Password", Password)
		.returning('PasswordID');
	when.all([
		query(passwordInsert)
	]).spread(
		function(data){
			return data[0].passwordid;
		}
	);
}

exports.GetAllPasswords = function GetPasswords(){
	var passwordsAll = squel.select()
		.from('Passwords');
	when.all([
		query(passwordsAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createContent(Description){
	var contentInsert = squel.insert()
		.into("Content")
		.set("Description", Description)
		.returning('ContentID');
	when.all([
		query(contentInsert)
	]).spread(
		function(data){
			return data[0].contentid;
		}
	);
}

exports.GetAllContent = function GetContent(){
	var contentAll = squel.select()
		.from('Content');
	when.all([
		query(contentAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createImage(ImagePath){
	var imageInsert = squel.insert()
		.into("Images")
		.set("ImagePath", ImagePath)
		.returning('ImageID');
	when.all([
		query(imageInsert)
	]).spread(
		function(data){
			return data[0].imageid;
		}
	);
}

exports.GetAllImages = function GetImages(){
	var imagesAll = squel.select()
		.from('Images');
	when.all([
		query(imagesAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createWriter(WriterName, WriterType, StaffingType, ImageID, ContentID){
	var writerInsert = squel.insert()
		.into("Writers")
		.set("WriterName", WriterName)
		.set("WriterType", WriterType)
		.set("StaffingType", StaffingType)
		.set("ImageID", ImageID)
		.set("ContentID", ContentID)
		.returning('WriterID');
	when.all([
		query(writerInsert)
	]).spread(
		function(data){
			return data[0].writerid;
		}
	);
}

exports.GetAllWriters = function GetWriters(){
	var writersAll = squel.select()
		.from('Writers')
		.join('Images','Images.ImageID = Writers.ImageID')
		.join('Content','Content.ContentID = Writers.ContentID');
	when.all([
		query(writersAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createCraftSession(CraftSessionName, ContentID, WriterID){
	var craftsessionInsert = squel.insert()
		.into("CraftSessions")
		.set("CraftSessionName", CraftSessionName)
		.set("ContentID", ContentID)
		.set("WriterID", WriterID)
		.returning('CraftSessionID');
	when.all([
		query(craftsessionInsert)
	]).spread(
		function(data){
			return data[0].craftsessionid;
		}
	);
}

exports.GetAllCraftSessions = function GetCraftSessions(){
	var craftsessionsAll = squel.select()
		.from('CraftSessions')
		.join('Content','Content.ContentID = CraftSessions.ContentID')
		.join('Writers','Writers.WriterID = CraftSessions.WriterID');
	when.all([
		query(craftsessionsAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createReading(ReadingDate, WriterID){
	var readingInsert = squel.insert()
		.into("Readings")
		.set("ReadingDate", ReadingDate)
		.set("WriterID", WriterID)
		.returning('ReadingsID');
	when.all([
		query(readingInsert)
	]).spread(
		function(data){
			return data[0].readingsid;
		}
	);
}

exports.GetAllReadings = function GetReadings(){
	var readingsAll = squel.select()
		.from('Readings')
		.join('Writers','Writers.WriterID = Readings.WriterID');
	when.all([
		query(readingsAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createWorkshop(WorkshopName, ContentID, WriterID){
	var workshopInsert = squel.insert()
		.into("Workshops")
		.set("WorkshopName", WorkshopName)
		.set("ContentID", ContentID)
		.set("WriterID", WriterID)
		.returning('WorkshopID');
	when.all([
		query(workshopInsert)
	]).spread(
		function(data){
			return data[0].workshopid;
		}
	);
}

exports.GetAllWorkshops = function GetWorkshops(){
	var workshopsAll = squel.select()
		.from('Workshops')
		.join('Content','Content.ContentID = Workshops.ContentID')
		.join('Writers','Writers.WriterID = Workshops.WriterID');
	when.all([
		query(workshopsAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

function createSponsor(SponsorName, Link, ContentID){
	var sponsorInsert = squel.insert()
		.into("Sponsors")
		.set("SponsorName", SponsorName)
		.set("Link", Link)
		.set("ContentID", ContentID)
		.returning('SponsorID');
	when.all([
		query(sponsorInsert)
	]).spread(
		function(data){
			return data[0].sponsorid;
		}
	);
}

exports.GetAllSponsors = function GetSponsors(){
	var sponsorsAll = squel.select()
		.from('Sponsors')
		.join('Content','Content.ContentID = Sponsors.ContentID');
	when.all([
		query(sponsorsAll)
	]).spread(
		function(data){
			return data;
		}
	);
}

