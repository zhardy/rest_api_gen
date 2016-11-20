import os, json

#Constants

FIRST_LINE = """DROP SCHEMA public CASCADE;\n
CREATE SCHEMA public;\n
GRANT ALL ON SCHEMA public TO postgres;\n
GRANT ALL ON SCHEMA public TO public;\n"""
CREATE_TABLE_BEGIN = "create table ";
OPEN_PARAN = "("
CLOSED_PARAN = ")"
SEMI = ";"
SPACE = " "
COMMA = ","
PRIMARY_KEY = "primary key "
FOREIGN_KEY = "foreign key"
REF = " references "
LINEBR = "\n";

with open('/home/zack/Downloads/data (1).json') as data_file:
	data = json.load(data_file);

db_arch = open('db_architecture.sql', 'w+')
db_arch.write(FIRST_LINE + LINEBR + LINEBR)

for table in data:
	db_arch.write(CREATE_TABLE_BEGIN + table["name"] + OPEN_PARAN +LINEBR)
	primary = None
	foreign = []

	for value in table["values"]:
		if "length" in value["type"] and len(value["type"]["length"]) != 0:
			db_arch.write(value["name"] + SPACE + value["type"]["name"] + OPEN_PARAN + value["type"]["length"] + CLOSED_PARAN + COMMA + LINEBR)
		else:
			db_arch.write(value["name"] + SPACE + value["type"]["name"] + COMMA + LINEBR)

		if value["isPrimary"]:
			primary = value

		if value["isReference"]:
			foreign.append(value)

	for key in foreign:
		db_arch.write(FOREIGN_KEY + OPEN_PARAN + key["name"] + CLOSED_PARAN + REF + key["foreignTable"] + COMMA + LINEBR)

	if primary != None:
		db_arch.write(PRIMARY_KEY + OPEN_PARAN + primary["name"] + CLOSED_PARAN + LINEBR)

	db_arch.write(CLOSED_PARAN + SEMI + LINEBR + LINEBR)
