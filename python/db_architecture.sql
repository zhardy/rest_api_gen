select 'drop table if exists "' || tablename || '" cascade;' from pg_tables;

create type writer_type as enum ('Fiction', 'Non-Fiction', 'Poetry');
create type staffing_type as enum ('Writer-in-Residence', 'Faculty');

create table Users(
UserID serial,
User varchar,
primary key (UserID)
);

create table Passwords(
PasswordID serial,
Password varchar,
primary key (PasswordID)
);

create table Content(
ContentID serial,
Description varchar,
primary key (ContentID)
);

create table Writers(
WriterID serial,
WriterName varchar,
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
CraftSessionName varchar,
ContentID serial,
WriterID serial,
foreign key(ContentID) references Content,
foreign key(WriterID) references Writers,
primary key (CraftSessionID)
);

create table Readings(
ReadingID serial,
ReadingDate date,
WriterID serial,
foreign key(WriterID) references Writers,
primary key (ReadingID)
);

create table Workshops(
WorkshopID serial,
WorkshopName varchar,
ContentID serial,
WriterID serial,
foreign key(ContentID) references Content,
foreign key(WriterID) references Writers,
primary key (WorkshopID)
);

create table Images(
ImageID serial,
ImagePath varchar,
primary key (ImageID)
);

create table UserToPassword(
UserToPasswordID serial,
UserID serial,
PasswordID serial,
foreign key(UserID) references Users,
foreign key(PasswordID) references Passwords,
primary key (UserToPasswordID)
);

create table Sponsors(
SponsorID serial,
SponsorName varchar,
Link varchar,
ContentID serial,
foreign key(ContentID) references Content,
primary key (SponsorID)
);

