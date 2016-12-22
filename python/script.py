import sys, os, json, subprocess


	OPEN_QUOTE = "'"
	CLOSED_QUOTE = "'"
	OPEN_PARAN = "("
	CLOSED_PARAN = ")"
	OPEN_BRACKET = "{"
	CLOSED_BRACKET = "}"
	SEMI = ";"
	SPACE = " "
	COMMA = ","
	LINEBR = "\n";
	FW_SLASH = "/"
	BW_SLASH = "\\"

	BEGIN_SCHEMA = """DROP SCHEMA public CASCADE;\n
CREATE SCHEMA public;\n
GRANT ALL ON SCHEMA public TO postgres;\n
GRANT ALL ON SCHEMA public TO public;\n"""
	CREATE_TABLE_BEGIN = "create table "
	CREATE_CUSTOM_BEGIN = "create type "
	AS_ENUM = " as enum "
	PRIMARY_KEY = "primary key "
	FOREIGN_KEY = "foreign key"
	REF = " references "

	BEGIN_ROUTES = """var express = require('express');\n
var router = express.Router();"""
	ROUTER_GET = "router.get('/"
	ROUTER_POST = "router.post('/"
	ROUTER_PUT = "router.put('/"
	ROUTER_PATCH = "router.patch('/"

	ROUTER_FUNCTION_BEGIN = "function(req, res) { "
	RES_JSON = "res.json"
	MODULE_EXPORTS = "module.exports = router;"


def sql_schema(filepath):


	#Constants


	#Get JSON
	with open(filepath) as data_file:
		data = json.load(data_file)

	#Create SQL schema document
	db_arch = open('db_architecture.sql', 'w+')
	db_arch.write(BEGIN_SCHEMA + LINEBR + LINEBR)

	#For each table in the data dictionary
	for table in data:
		#If type exists as a property of this table and the type property equals custom
		if "type" not in table and table["type"] == "Custom":
			#Write out a custom enumerator with each value belonging in this table
			db_arch.write(CREATE_CUSTOM_BEGIN + table["name"] + AS_ENUM + OPEN_PARAN)
			for value in table["values"]:
				if value != table["values"][len(table["values"])-1]:
					db_arch.write(OPEN_QUOTE + value + CLOSED_QUOTE + COMMA)
				else:
					db_arch.write(OPEN_QUOTE + value + CLOSED_QUOTE + CLOSED_PARAN + SEMI + LINEBR + LINEBR)

		else:
			#Variables to be set after going through values for each
			primary = None
			foreign = []

			db_arch.write(CREATE_TABLE_BEGIN + table["name"] + OPEN_PARAN + LINEBR)
			for value in table["values"]:
				if "length" in value["type"] and value["type"]["length"] != 0:
					db_arch.write(value["name"] + SPACE + value["type"]["name"] + OPEN_PARAN + str(value["type"]["length"]) + CLOSED_PARAN + COMMA + LINEBR)
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


def rest_api_gen(filepath, shell_path, location_for_api):


	subprocess.call([shell_path, location_for_api])
	with open(filepath) as data_file:
		data = json.load(data_file)
	
	for table in data:
		if "type" not in table:
			js_route = open(location_for_api + "/" + table["name"], 'w')
			js_route.write(BEGIN_ROUTES +LINEBR + LINEBR)
			js_route.write(ROUTER_GET + table["name"] + COMMA + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write()




def main():
	if len(sys.argv) < 4:
		filepath = raw_input("Please provide a filepath for the JSON:\n")
		shell_path = raw_input("Please provide a filepath for the shell script:\n")
		directory = raw_input("Please provide a filepath to create your new REST API:\n")
	else:
		filepath = sys.argv[1]
		shell_path = sys.argv[2]
		directory = sys.argv[3]
	#sql_schema(filepath)
	rest_api_gen(filepath, shell_path, directory)

main()


