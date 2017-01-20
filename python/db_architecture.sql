DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON SCHEMA public TO public;


create type writer_type as enum ('Fiction','Non-Fiction','Poetry');

create type staffing_type as enum ('Writer-in-Residence','Faculty');

create table Users(
UserID serial,
Username varchar(12),
primary key (UserID)
);

create table Passwords(
PasswordID serial,
Password varchar(12),
primary key (PasswordID)
);

create table Content(
ContentID serial,
Description varchar(1000),
primary key (ContentID)
);

create table Images(
ImageID serial,
ImagePath varchar(80),
primary key (ImageID)
);

create table Writers(
WriterID serial,
WriterName varchar(80),
WriterType writer_type,
StaffingType staffing_type,
ImageID serial,
ContentID serial,
foreign key(ImageID) references Images,
foreign key(ContentID) references Content,
primary key (WriterID)
);

create table CraftSessions(
CraftSessionID serial,
CraftSessionName varchar(80),
ContentID serial,
WriterID serial,
foreign key(ContentID) references Content,
foreign key(WriterID) references Writers,
primary key (CraftSessionID)
);

create table Readings(
ReadingsID serial,
ReadingDate date,
WriterID serial,
foreign key(WriterID) references Writers,
primary key (ReadingsID)
);

create table Workshops(
WorkshopID serial,
WorkshopName varchar(80),
ContentID serial,
WriterID serial,
foreign key(ContentID) references Content,
foreign key(WriterID) references Writers,
primary key (WorkshopID)
);

create table Sponsors(
SponsorID serial,
SponsorName varchar(80),
Link varchar(80),
ContentID serial,
foreign key(ContentID) references Content,
primary key (SponsorID)
);

