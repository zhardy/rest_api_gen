#!/usr/bin/env python

import sys, os, json, subprocess, copy


OPEN_QUOTE = "'"
CLOSED_QUOTE = "'"
DOUBLE_QUOTE = '"'
OPEN_PARAN = "("
CLOSED_PARAN = ")"
OPEN_BRACKET = "{"
CLOSED_BRACKET = "}"
OPEN_ARRAY = "["
CLOSED_ARRAY = "]"
SEMI = ";"
SPACE = " "
COMMA = ","
COLON = ":"
LINEBR = "\n";
FW_SLASH = "/"
BW_SLASH = "\\"
TAB = "\t"
EQUAL = " = "

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
END_ROUTES = "module.exports = router;"
ROUTER_GET = "router.get('/"
ROUTER_POST = "router.post('/"
ROUTER_PUT = "router.put('/"
ROUTER_PATCH = "router.patch('/"
VAR = "var "
REQ_BODY = "req.body."
REQ_PARAM = "req.param."
DB_GET = "Get"
DB_UPDATE = "Update"
DB_ALL = "All"
DB_CREATE = "Create"
BEGIN_IF = "if("
BY = "By"
SUCCESS = "success"
ROUTER_FUNCTION_BEGIN = "function(req, res) { "
ROUTER_FUNCTION_END = "}); \n\n"
RES_JSON = "res.json"
RES_INFO = "info: "
MODULE_EXPORTS = "module.exports = router;"

DB_ACCESS_BEGIN = """var pg = require('pg');
var squel = require('squel').useFlavour('postgres');
var query = require('pg-query');
var when = require('when');\n
query.connectionParameters = "postgres://"\n
"""

DB_INTERNAL_CREATE = "create"
DB_ACCESS_FUNCTION_BEGIN = "function"
DB_ANONYMOUS_CALLBACK  = "function(data){\n\t\t\treturn data[0]."


DB_ACCESS_INSERT = "Insert"
DB_ACCESS_SQUEL_INSERT = "squel.insert()"
DB_ACCESS_INTO = ".into"
DB_ACCESS_SET = ".set"
DB_ACCESS_RETURNING = ".returning"
DB_ACCESS_WHEN = "when.all(["
DB_ACCESS_QUERY = "query"
DB_ACCESS_SPREAD = "]).spread("


splitter_for_appjs = "var users = require('./routes/users');\n"

def remove_s(string):
	if str.lower(string[len(string)-1]) == "s":
		string = string[0:len(string)-1]
	return string



def sql_schema(filepath):

	#Get JSON
	with open(filepath) as data_file:
		data = json.load(data_file)

	#Create SQL schema document
	db_arch = open('db_architecture.sql', 'w+')
	db_arch.write(BEGIN_SCHEMA + LINEBR + LINEBR)

	#For each table in the data dictionary
	for table in data:
		#If type exists as a property of this table and the type property equals custom
		if "type" in table and table["type"] == "Custom":
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
				if "length" in value["type"] and int(value["type"]["length"]) != 0:
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


def if_statements_for_requests_gen(array):
	if_statements_for_requests = ""
	only_declaration = ""
	for value in array:
		value = value["name"]
		if_statements_for_requests += TAB + VAR + value + SEMI + LINEBR
		if_statements_for_requests += TAB + BEGIN_IF + REQ_BODY + value + CLOSED_PARAN + OPEN_BRACKET + LINEBR
		if_statements_for_requests += TAB + TAB + value + EQUAL + REQ_BODY + value + SEMI + LINEBR
		if_statements_for_requests += TAB + CLOSED_BRACKET + LINEBR + LINEBR
		only_declaration += TAB + VAR + value + EQUAL + REQ_BODY + value + SEMI + LINEBR
	return [if_statements_for_requests, only_declaration]

def foreign_reference_route_gen(value_array, table_name):
	foreign_reference_array = [remove_s(str(value["foreignTable"])) for value in value_array if value["isReference"] == True]
	foreign_reference_routes = ""
	for foreign_reference in foreign_reference_array:
		second_value_array = [val for val in value_array if foreign_reference not in val["name"]]
		foreign_reference_routes += ROUTER_GET + foreign_reference + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR
		foreign_reference_routes += if_statements_for_requests_gen(second_value_array)[0]
		foreign_reference_routes += TAB + VAR + foreign_reference + EQUAL + DB_GET + foreign_reference + BY + table_name + OPEN_PARAN + OPEN_ARRAY 
		foreign_reference_routes += ', '.join([value["name"] for value in second_value_array]) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR
		foreign_reference_routes += TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + foreign_reference + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR
		foreign_reference_routes += ROUTER_FUNCTION_END
	return foreign_reference_routes


def rest_api_gen(filepath, shell_path, location_for_api):
	subprocess.call([shell_path, location_for_api])
	with open(filepath) as data_file:
		data = json.load(data_file)
	list_of_routes = []
	for table in data:
		if "type" not in table:
			location_for_js_route = location_for_api + "/routes/" + table["name"] 
			list_of_routes.append(location_for_js_route )
			js_route = open(location_for_js_route + ".js", 'w')
			table_name = str(table["name"])

			#list of values names
			value_array = table["values"]
			#get primary value
			primary_value = next((str(value["name"]) for value in value_array if value["isPrimary"] == True), str(value_array[0]["name"]))

			js_route.write(BEGIN_ROUTES + LINEBR + LINEBR)

			#everything in a table

			js_route.write(ROUTER_GET + DB_ALL + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + table_name + EQUAL + DB_GET + DB_ALL + table_name + OPEN_PARAN + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + table_name + CLOSED_BRACKET + CLOSED_PARAN + LINEBR)
			js_route.write(ROUTER_FUNCTION_END)


			table_name = remove_s(table_name)
			#get single entry in table based on various info sent through the request
			js_route.write(ROUTER_GET + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			if_statements_for_requests = if_statements_for_requests_gen(value_array)
			only_declaration = if_statements_for_requests[1]
			if_statements_for_requests = if_statements_for_requests[0]
			js_route.write(if_statements_for_requests)
			js_route.write(TAB + VAR + SPACE + table_name + EQUAL + DB_GET + table_name + OPEN_PARAN + OPEN_ARRAY)
			js_route.write(', '.join([str(val["name"]).format(val) for val in value_array]) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + table_name + CLOSED_BRACKET + CLOSED_PARAN + LINEBR)
			js_route.write(ROUTER_FUNCTION_END)

			js_route.write(ROUTER_POST  + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(only_declaration)
			js_route.write(TAB + VAR + primary_value + EQUAL + DB_CREATE + table_name + OPEN_PARAN + OPEN_ARRAY)
			js_route.write(', '.join([str(val["name"]).format(val) for val in value_array]) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + primary_value + CLOSED_BRACKET + CLOSED_PARAN + LINEBR)
			js_route.write(ROUTER_FUNCTION_END)

			#write all routes to get an entry in a foreign table based on information about the table that is referencing it

			#for example, if you had a User table that referenced a password table as a foreign reference and ran this code it would generate
			# /User/Password and get the Password entry associated to the information based to the User table
			js_route.write(foreign_reference_route_gen(value_array, table_name))

			# route developed in the following pattern /{tablename}/#primaryValue
			js_route.write(ROUTER_GET +  COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			js_route.write(TAB + VAR + table_name + EQUAL + DB_GET + table_name + BY + primary_value + OPEN_PARAN + primary_value + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + table_name + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)
			# beginning work on put and patch

			#All values except primary
			all_except_primary = [value for value in value_array if value["isPrimary"] == False]
			if_except_primary = if_statements_for_requests_gen(all_except_primary)[0]

			js_route.write(ROUTER_PUT + COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + SPACE + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			js_route.write(if_except_primary)
			js_route.write(TAB + VAR + SUCCESS + EQUAL + DB_UPDATE + table_name + OPEN_PARAN + OPEN_ARRAY)
			js_route.write(', '.join([str(val["name"]).format(val) for val in all_except_primary]) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + SUCCESS + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)


			js_route.write(ROUTER_PATCH +  COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + SPACE + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			js_route.write(only_declaration)
			js_route.write(TAB + VAR + SUCCESS + EQUAL + DB_UPDATE + table_name + OPEN_PARAN + OPEN_ARRAY)
			js_route.write(', '.join([str(val["name"]).format(val) for val in all_except_primary]) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + SUCCESS + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)
			
			js_route.write(END_ROUTES)

	#read in app.js to include routes in routes
	with open(location_for_api + "/app.js") as app_file:
		data = app_file.read()
	data = data.split(splitter_for_appjs)
	app_file = open(location_for_api + "/app.js", 'w')
	#write beginning of file back
	app_file.write(data[0])
	for route in list_of_routes:
		#remove directory for api so we can refer to it locally (easier for deployment)
		route = route.split(location_for_api)[1]
		#create a variable name for this route to be known as
		name = route.split("/routes/")[1]
		#set variable name (described above) equal to route module location
		app_file.write("var " + name + " = require('." + route + "');\n")
	#The last piece of data is equal to itself, split on the definition of app.use('/users') so that we can set the application to use the routes defined above
	data[1] = data[1].split("app.use('/users', users);")
	#write the first part of the last section out
	app_file.write(data[1][0])
	for route in list_of_routes:
		#again, get the last name
		name = route.split("/routes/")[1]
		#set the web application to use the name
		app_file.write("app.use('/"+ name + "', " + name + ");\n")
	#write the final part out
	app_file.write(data[1][1])


def sql_access(filepath, location_for_api):
	
	#modifying pg-query npm library for use with this project

	with open(location_for_api + "/node_modules/pg-query/index.js") as pg_query_lib:
		data = pg_query_lib.read()
	data = data.split('q = text.toQuery ? text.toQuery() : text;')
	data.insert(1, 'q = text.toQuery ? text.toQuery() : (text.toParam ? text.toParam() : text.toString());')
	pg_query = open(location_for_api + "/node_modules/pg-query/index.js", 'w')
	for modified_line in data:
		pg_query.write(modified_line)

	with open(filepath) as data_file:
		data = json.load(data_file)

	lib_directory = location_for_api + "/lib/"
	if(not os.path.exists(lib_directory)):
		os.mkdir(lib_directory)
	

	db_access = open(lib_directory + "dbAccess.js", 'w')
	db_access.write(DB_ACCESS_BEGIN)

	for table in data:
		if "type" not in table:
			table_name = remove_s(str(table["name"]))
			value_array = table["values"]
			parameters = [str(val["name"]).format(val) for val in value_array if val["isPrimary"] == False]
			primary_value = next((str(value["name"]) for value in value_array if value["isPrimary"] == True), str(value_array[0]["name"]))
			function_name = table_name.lower() + DB_ACCESS_INSERT

			db_access.write(DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_INTERNAL_CREATE + table_name + OPEN_PARAN + (', ').join(parameters) + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + VAR + function_name + EQUAL + DB_ACCESS_SQUEL_INSERT + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_INTO + OPEN_PARAN + DOUBLE_QUOTE + table["name"] + DOUBLE_QUOTE + CLOSED_PARAN + LINEBR)
			for param in parameters:
				db_access.write(TAB + TAB + DB_ACCESS_SET + OPEN_PARAN + DOUBLE_QUOTE + param + DOUBLE_QUOTE + COMMA + SPACE + param + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_RETURNING + OPEN_PARAN + OPEN_QUOTE + primary_value + CLOSED_QUOTE + CLOSED_PARAN + SEMI + LINEBR)
			db_access.write(TAB + DB_ACCESS_WHEN + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + function_name + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + DB_ACCESS_SPREAD + LINEBR)
			db_access.write(TAB + TAB + DB_ANONYMOUS_CALLBACK + primary_value.lower() + SEMI + LINEBR)
			db_access.write(TAB + TAB + CLOSED_BRACKET + LINEBR)
			db_access.write(TAB + CLOSED_PARAN + SEMI + LINEBR)
			db_access.write(CLOSED_BRACKET + LINEBR + LINEBR)
 





def main():
	# if len(sys.argv) < 4:
	# 	filepath = raw_input("Please provide an absolute filepath for the JSON:\n")
	# 	shell_path = raw_input("Please provide an absolute filepath for the shell script:\n")
	# 	directory = raw_input("Please provide an absolute filepath to create your new REST API:\n")
	# else:
	# 	filepath = sys.argv[1]
	# 	shell_path = sys.argv[2]
	# 	directory = sys.argv[3]
	# sql_schema(filepath)

	filepath = "~/Downloads/data (1).json"
	shell_path = "~/programming/rest_api_gen/node/node.sh"
	directory = "~/programming/rest_api_gen/test"

	if "~" in filepath:
		filepath = os.path.expanduser(filepath)

	if "~" in shell_path:
		shell_path = os.path.expanduser(shell_path)

	if "~" in directory:
		directory = os.path.expanduser(directory)

	#sql_schema(filepath)
	#rest_api_gen(filepath, shell_path, directory)
	sql_access(filepath, directory)

main()