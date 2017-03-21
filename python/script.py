import sys, os, json, subprocess

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
DOT = "."
OR_FALSE = " || "
FALSE = "false"
NULL = "null"

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
var router = express.Router();\n
var db = require('../lib/dbAccess.js')"""
END_ROUTES = "module.exports = router;"
ROUTER_GET = "router.get('/"
ROUTER_POST = "router.post('/"
ROUTER_PUT = "router.put('/"
ROUTER_PATCH = "router.patch('/"
VAR = "var "
REQ_BODY = "req.body."
REQ_PARAM = "req.params."
ROUTE_DB_ACCESS = "db."
BEGIN_IF = "if("
BY = "By"
SUCCESS = "success"
ROUTER_FUNCTION_BEGIN = "function(req, res) { "
ROUTE_THEN = "then(function(success){"
ROUTER_FUNCTION_END = "}); \n\n"
RES_JSON_SUCCESS = "res.json({success:true,"
RES_INFO = "info: "
ROUTE_ERROR_FUNCTION = "\tfunction(err){\n\t\t\tres.json({success:false, error:err.toString()});\n\t});\n"

DB_ACCESS_BEGIN = """var pg = require('pg');
var squel = require('squel').useFlavour('postgres');
var query = require('pg-query');
var when = require('when');\n
query.connectionParameters = "postgres://"\n
"""

DB_INTERNAL_CREATE = "create"
DB_ACCESS_FUNCTION_BEGIN = "function"
DB_ANONYMOUS_CALLBACK  = "function(data){\n\t\t\treturn data"
DB_EXPORTS = "exports."
DB_FIRST_RESULT = "[0]"
DB_ARRAY = "Array"

DB_ACCESS_INSERT = "Insert"
DB_ACCESS_SQUEL_INSERT = "squel.insert()"
DB_ACCESS_SQUEL_SELECT = "squel.select()"
DB_ACCESS_SQUEL_UPDATE = "squel.update()"
DB_TABLE = ".table"
DB_ACCESS_INTO = ".into"
DB_ACCESS_SET = ".set"
DB_ACCESS_RETURNING = ".returning"
DB_ACCESS_WHEN = "return when.all(["
DB_ACCESS_WHERE = ".where"
DB_ACCESS_QUERY = "query"
DB_ACCESS_SPREAD = "]).spread("
DB_ACCESS_FROM = ".from"
DB_ACCESS_JOIN = ".join"
DB_GET = "Get"
DB_UPDATE = "Update"
DB_ALL = "All"
DB_CREATE = "Create"
DB_ERROR = "function(err){\n\t\t\twhen.reject(err);\n\t\t});"
DB_TEMP = "temp"
DB_QUERY_OBJECT = "var queryObject = {};"
JS_EQUAL = " === "
DB_PROP_FOR = "for(var prop in "
PROP = "prop"
SET_QUERY_OBJECT = "queryObject[prop] = "
QUERY_LENGTH_STATEMENT = "if(Object.keys(queryObject).length && Object.keys(queryObject).length > 1){"
DB_SET_FIELDS =".setFields(queryObject)"
CLONE_WHERE = '.clone().where(prop.toString() + " =?", '
splitter_for_appjs = "var users = require('./routes/users');\n"

def remove_s(string):
	if str.lower(string[len(string)-1]) == "s":
		string = string[0:len(string)-1]
	return string

def if_statements_for_requests_gen(array):
	if_statements_for_requests = ""
	for value in array:
		value = value["name"]
		if_statements_for_requests += TAB + VAR + value + SEMI + LINEBR
		if_statements_for_requests += TAB + BEGIN_IF + REQ_BODY + value + OR_FALSE + REQ_BODY + value + JS_EQUAL + FALSE + CLOSED_PARAN + OPEN_BRACKET + LINEBR
		if_statements_for_requests += TAB + TAB + value + EQUAL + REQ_BODY + value + SEMI + LINEBR
		if_statements_for_requests += TAB + CLOSED_BRACKET + LINEBR + LINEBR
	return if_statements_for_requests 

def foreign_reference_route_gen(value_array, object_name):
	foreign_reference_array = [remove_s(str(value["foreignTable"])) for value in value_array if value["isReference"] == True]
	foreign_reference_routes = ""
	for foreign_reference in foreign_reference_array:
		second_value_array = [val for val in value_array if foreign_reference not in val["name"]]
		foreign_reference_routes += ROUTER_GET + foreign_reference + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR
		test = if_statements_for_requests_gen(second_value_array)
		foreign_reference_routes += test
		foreign_reference_routes += TAB + VAR + foreign_reference + EQUAL + ROUTE_DB_ACCESS + DB_GET + foreign_reference + BY + object_name + OPEN_PARAN + OPEN_BRACKET + LINEBR 
		foreign_reference_routes += ',\n'.join(["\t\t" + value["name"] + COLON + value["name"] for value in second_value_array]) + LINEBR + TAB + CLOSED_BRACKET + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR
		foreign_reference_routes += TAB + TAB + RES_JSON_SUCCESS + RES_INFO + foreign_reference + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR
		foreign_reference_routes += TAB + CLOSED_BRACKET + COMMA + LINEBR
		foreign_reference_routes += ROUTE_ERROR_FUNCTION
		foreign_reference_routes += ROUTER_FUNCTION_END
	return foreign_reference_routes

def if_statements_for_database_gen(array, object_name):
	if_statements_for_database = ""
	for value in array:
		value = str(value["name"])
		if_statements_for_database += TAB + VAR + value + SEMI + LINEBR
		if_statements_for_database += TAB + BEGIN_IF + object_name + DOT + value + OR_FALSE + object_name + DOT + value + JS_EQUAL + FALSE + CLOSED_PARAN + OPEN_BRACKET + LINEBR
		if_statements_for_database += TAB + TAB + value + EQUAL + object_name + DOT + value + SEMI + LINEBR + TAB + CLOSED_BRACKET + LINEBR
	return if_statements_for_database

def get_all_db_route(route_writer, db_writer, object_name, table_name, foreign_reference_array):
	temp_var_name = table_name.lower() + DB_ALL
	function_name = DB_GET + DB_ALL + table_name
	route_writer.write(ROUTER_GET + DB_ALL + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
	route_writer.write(TAB + VAR + object_name + EQUAL + ROUTE_DB_ACCESS + function_name + OPEN_PARAN + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
	route_writer.write(TAB + RES_JSON_SUCCESS + RES_INFO + object_name + CLOSED_BRACKET + CLOSED_PARAN + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
	route_writer.write(TAB + ROUTE_ERROR_FUNCTION)
	route_writer.write(ROUTER_FUNCTION_END)

	db_writer.write(DB_EXPORTS + DB_GET + DB_ALL + table_name + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_GET + object_name + OPEN_PARAN + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
	db_writer.write(TAB + VAR + temp_var_name + EQUAL +  DB_ACCESS_SQUEL_SELECT + LINEBR)
	db_writer.write(TAB + TAB + DB_ACCESS_FROM + OPEN_PARAN + OPEN_QUOTE + table_name + CLOSED_QUOTE + CLOSED_PARAN)
	if len(foreign_reference_array) > 0:
		db_writer.write(LINEBR)
	else:
		db_writer.write(SEMI + LINEBR)

	for foreign_reference in foreign_reference_array:
		foreign_table = str(foreign_reference["foreignTable"])
		db_writer.write(TAB + TAB + DB_ACCESS_JOIN + OPEN_PARAN + OPEN_QUOTE + foreign_table + CLOSED_QUOTE + COMMA + NULL + COMMA + OPEN_QUOTE + foreign_table + DOT)
		db_writer.write(str(foreign_reference["foreignValue"]) + EQUAL + table_name + DOT + str(foreign_reference["name"]) + CLOSED_QUOTE + CLOSED_PARAN)
		if foreign_reference == foreign_reference_array[len(foreign_reference_array)-1]:
			db_writer.write(SEMI + LINEBR)
		else:
			db_writer.write(LINEBR)
	db_writer.write(TAB + DB_ACCESS_WHEN + LINEBR)
	db_writer.write(TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + temp_var_name + CLOSED_PARAN + LINEBR)
	db_writer.write(TAB + DB_ACCESS_SPREAD + LINEBR)
	db_writer.write(TAB + TAB + DB_ANONYMOUS_CALLBACK  + SEMI + LINEBR)
	db_writer.write(TAB + TAB + CLOSED_BRACKET + COMMA + LINEBR)
	db_writer.write(TAB + TAB + DB_ERROR + LINEBR)
	db_writer.write(CLOSED_BRACKET + LINEBR + LINEBR)

	#return db_get + db_all + table_name

def get_single_db_route(route_writer, db_writer, object_name, table_name, value_array, foreign_join):
	function_name = DB_GET + object_name
	temp_var_name = DB_TEMP + object_name
	if_statements_for_requests = if_statements_for_requests_gen(value_array)

	route_writer.write(ROUTER_GET + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
	route_writer.write(if_statements_for_requests)
	route_writer.write(TAB + VAR + SPACE + object_name + EQUAL + ROUTE_DB_ACCESS +  function_name + OPEN_PARAN + OPEN_BRACKET + LINEBR)
	route_writer.write(',\n'.join(["\t\t" + str(val["name"]).format(val) + COLON + str(val["name"]).format(val) for val in value_array]) + LINEBR)
	route_writer.write(TAB + CLOSED_BRACKET + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
	route_writer.write(TAB + RES_JSON_SUCCESS + RES_INFO + object_name + CLOSED_BRACKET + CLOSED_PARAN + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
	route_writer.write(TAB + ROUTE_ERROR_FUNCTION)
	route_writer.write(ROUTER_FUNCTION_END)

	db_writer.write(DB_EXPORTS + DB_GET + object_name + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_GET + object_name + OPEN_PARAN + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
	db_writer.write(TAB + VAR + temp_var_name + EQUAL + DB_ACCESS_SQUEL_SELECT + LINEBR)
	db_writer.write(TAB + TAB + DB_ACCESS_FROM + OPEN_PARAN + OPEN_QUOTE + object_name + CLOSED_QUOTE + CLOSED_PARAN + LINEBR)
	
	if(hasattr(foreign_join,'length')):
		db_writer.write(foreign_join + SEMI + LINEBR)

	db_writer.write(TAB + DB_PROP_FOR + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
	db_writer.write(TAB + TAB + BEGIN_IF + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + OR_FALSE + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + JS_EQUAL + FALSE + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
	db_writer.write(TAB + TAB + TAB + temp_var_name + EQUAL + temp_var_name + CLONE_WHERE + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + DOT + "toString())" + SEMI + LINEBR)
	db_writer.write(TAB + TAB + CLOSED_BRACKET + LINEBR + TAB + CLOSED_BRACKET + LINEBR)
	db_writer.write(TAB + DB_ACCESS_WHEN + LINEBR + TAB + TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + temp_var_name + CLOSED_PARAN + LINEBR)
	db_writer.write(TAB + TAB + TAB + DB_ACCESS_SPREAD + LINEBR + TAB + TAB + TAB + DB_ANONYMOUS_CALLBACK + SEMI + LINEBR)
	db_writer.write(TAB + TAB + CLOSED_BRACKET + COMMA + LINEBR + TAB + TAB + DB_ERROR + LINEBR)
	db_writer.write(CLOSED_BRACKET + LINEBR + LINEBR)

	#return db_get + object_name

def post_db_route(route_writer, db_writer, object_name, table_name, primary_value, all_except_primary):
	function_name = DB_CREATE + object_name
	route_writer.write(ROUTER_POST  + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
	if_statements_for_requests = if_statements_for_requests_gen(all_except_primary)
	route_writer.write(if_statements_for_requests)
	route_writer.write(TAB + VAR + primary_value + EQUAL + ROUTE_DB_ACCESS + function_name + OPEN_PARAN + OPEN_BRACKET + LINEBR )
	route_writer.write(',\n'.join(["\t\t" + str(val["name"]).format(val) + COLON + str(val["name"]).format(val) for val in all_except_primary]) + LINEBR) 
	route_writer.write(TAB + CLOSED_BRACKET + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
	route_writer.write(TAB + RES_JSON_SUCCESS + RES_INFO + primary_value + CLOSED_BRACKET + CLOSED_PARAN + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
	route_writer.write(TAB + ROUTE_ERROR_FUNCTION)
	route_writer.write(ROUTER_FUNCTION_END)

	db_writer.write(DB_EXPORTS + DB_CREATE + object_name + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_CREATE + object_name + OPEN_PARAN)
	db_writer.write(object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
	db_writer.write(if_statements_for_database_gen(all_except_primary, object_name))
	db_writer.write(TAB + DB_TEMP + DB_CREATE + object_name + EQUAL + DB_ACCESS_SQUEL_INSERT + LINEBR)
	db_writer.write(TAB + TAB + DB_ACCESS_INTO + OPEN_PARAN + OPEN_QUOTE + table_name + CLOSED_QUOTE + CLOSED_PARAN + LINEBR)
	
	for prop in all_except_primary:
		prop = str(prop["name"])
		db_writer.write(TAB + TAB + DB_ACCESS_SET + OPEN_PARAN + OPEN_QUOTE + prop + CLOSED_QUOTE + COMMA + prop + CLOSED_PARAN +  LINEBR)
	
	db_writer.write(TAB + DB_ACCESS_WHEN + LINEBR)
	db_writer.write(TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + DB_TEMP + DB_CREATE + object_name + CLOSED_PARAN + LINEBR)
	db_writer.write(TAB + DB_ACCESS_SPREAD + LINEBR)
	db_writer.write(TAB + TAB + DB_ANONYMOUS_CALLBACK + DB_FIRST_RESULT + DOT + primary_value.lower() + SEMI + LINEBR)
	db_writer.write(TAB + CLOSED_BRACKET + COMMA + LINEBR)
	db_writer.write(TAB + TAB + DB_ERROR + LINEBR)
	db_writer.write(CLOSED_BRACKET + LINEBR + LINEBR)

	#return function_name
def get_primary_value_db_route(route_writer, db_writer, object_name, primary_value):
	route_writer.write(ROUTER_GET + COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
	route_writer.write(TAB + VAR + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
	route_writer.write(TAB + VAR + object_name + EQUAL + ROUTE_DB_ACCESS + DB_GET + object_name + BY + primary_value + OPEN_PARAN + primary_value + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
	route_writer.write(TAB + TAB + RES_JSON_SUCCESS + RES_INFO + object_name + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
	route_writer.write(TAB + ROUTE_ERROR_FUNCTION)
	route_writer.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)




def sql_schema(filepath, shell_path, location_for_api):
	subprocess.call([shell_path, location_for_api])
	#Get JSON
	list_of_routes = []

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
			table_name = str(table["name"])
			object_name = remove_s(table_name)
			#javascript route
			location_for_js_route = location_for_api + "/routes/" + table_name
			lib_directory = location_for_api + "/lib/"

			if(not os.path.exists(lib_directory)):
				os.mkdir(lib_directory)
			js_route = open(location_for_js_route + ".js", 'w')
			db_access = open(lib_directory + "dbAccess.js", 'a')

			list_of_routes.append(location_for_js_route )

			#list of values names
			value_array = table["values"]

			#list of values that are non primary
			all_except_primary = [value for value in value_array if value["isPrimary"] == False]

			#get primary value
			primary_value = next((str(value["name"]) for value in value_array if value["isPrimary"] == True), str(value_array[0]["name"]))

			#array of just foreign references
			foreign_reference_array = [value for value in value_array if value["isReference"] == True]

			#begin table creation
			db_arch.write(CREATE_TABLE_BEGIN + table_name + OPEN_PARAN + LINEBR)

			#for each value in table
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

			foreign_join = ""
			for foreign_reference in foreign_reference_array:
				foreign_table = str(foreign_reference["foreignTable"])
				foreign_join += TAB + TAB + DB_ACCESS_JOIN + OPEN_PARAN + OPEN_QUOTE + foreign_table + CLOSED_QUOTE + COMMA + NULL + COMMA + OPEN_QUOTE + foreign_table + DOT
				foreign_join += str(foreign_reference["foreignValue"]) + EQUAL + table_name + DOT + str(foreign_reference["name"]) + CLOSED_QUOTE + CLOSED_PARAN
				if foreign_reference != foreign_reference_array[len(foreign_reference_array)-1]:
					foreign_join += LINEBR
			
			db_arch.write(CLOSED_PARAN + SEMI + LINEBR + LINEBR)

			js_route.write(BEGIN_ROUTES + LINEBR + LINEBR)

			#everything in a table
			get_all_db_route(js_route, db_access, object_name, table_name, foreign_reference_array)

			#get single entry in table based on various info sent through the request
			get_single_db_route(js_route, db_access, object_name, table_name, value_array, foreign_join)

			#post to create an object of the table
			post_db_route(js_route, db_access, object_name, table_name, primary_value, all_except_primary)

			#write all routes to get an entry in a foreign table based on information about the table that is referencing it

			#for example, if you had a User table that referenced a password table as a foreign reference and ran this code it would generate
			# /User/Password and get the Password entry associated to the information based to the User table. Not useful in that scenario, but useful in others.
			js_route.write(foreign_reference_route_gen(value_array, object_name))

			# route developed in the following pattern /{tablename}/#primaryValue
			get_primary_value_db_route(js_route, db_access, object_name, primary_value)
			# js_route.write(ROUTER_GET + COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			# js_route.write(TAB + VAR + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			# js_route.write(TAB + VAR + object_name + EQUAL + ROUTE_DB_ACCESS + DB_GET + object_name + BY + primary_value + OPEN_PARAN + primary_value + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
			# js_route.write(TAB + TAB + RES_JSON_SUCCESS + RES_INFO + object_name + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
			# js_route.write(TAB + ROUTE_ERROR_FUNCTION)
			# js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)

			#All values except primary
			if_except_primary = if_statements_for_requests_gen(all_except_primary)
			only_declaration_except_primary = ';\n'.join(["\tvar " + str(val["name"]).format(val) + EQUAL + REQ_PARAM + str(val["name"]).format(val) for val in all_except_primary])
			only_declaration_except_primary += ";\n"


			#Put route
			js_route.write(ROUTER_PUT + COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + SPACE + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			js_route.write(if_except_primary)
			js_route.write(TAB + VAR + SUCCESS + EQUAL + ROUTE_DB_ACCESS + DB_UPDATE + object_name + OPEN_PARAN + OPEN_BRACKET + LINEBR)
			js_route.write(',\n'.join(["\t\t" + str(val["name"]).format(val) + COLON + str(val["name"]).format(val) for val in value_array]) + LINEBR)
			js_route.write(TAB + CLOSED_BRACKET + CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
			js_route.write(TAB + TAB + RES_JSON_SUCCESS + RES_INFO + SUCCESS + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR + TAB + CLOSED_BRACKET + COMMA + LINEBR)
			js_route.write(TAB + ROUTE_ERROR_FUNCTION)
			js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)

			#patch route
			js_route.write(ROUTER_PATCH +  COLON + primary_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + primary_value + EQUAL + REQ_PARAM + primary_value + SEMI + LINEBR)
			js_route.write(only_declaration_except_primary)
			js_route.write(TAB + VAR + SUCCESS + EQUAL + ROUTE_DB_ACCESS + DB_UPDATE + object_name + OPEN_PARAN + OPEN_BRACKET + LINEBR)
			js_route.write(',\n'.join(["\t\t" + str(val["name"]).format(val) + COLON + str(val["name"]).format(val) for val in value_array]) + LINEBR )
			js_route.write(TAB + CLOSED_BRACKET+ CLOSED_PARAN + DOT + ROUTE_THEN + LINEBR)
			js_route.write(TAB + TAB + RES_JSON_SUCCESS + RES_INFO + SUCCESS + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR + TAB +CLOSED_BRACKET + COMMA + LINEBR)
			js_route.write(TAB + ROUTE_ERROR_FUNCTION)
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

	export_function_array = []

	for table in data:
		if "type" not in table:
			object_name = remove_s(str(table["name"]))
			table_name = str(table["name"])
			value_array = table["values"]
			parameters = [str(val["name"]).format(val) for val in value_array if val["isPrimary"] == False]
			primary_value = next((str(value["name"]) for value in value_array if value["isPrimary"] == True), str(value_array[0]["name"]))
			internal_create_function_name = object_name.lower() + DB_ACCESS_INSERT
			by_primary_value = object_name + BY + primary_value 
			foreign_reference_array = [value for value in value_array if value["isReference"] == True]


			db_access.write(DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_INTERNAL_CREATE + object_name + OPEN_PARAN + (', ').join(parameters) + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + VAR + internal_create_function_name + EQUAL + DB_ACCESS_SQUEL_INSERT + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_INTO + OPEN_PARAN + DOUBLE_QUOTE + table["name"] + DOUBLE_QUOTE + CLOSED_PARAN + LINEBR)
			for param in parameters:
				db_access.write(TAB + TAB + DB_ACCESS_SET + OPEN_PARAN + DOUBLE_QUOTE + param + DOUBLE_QUOTE + COMMA + SPACE + param + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_RETURNING + OPEN_PARAN + OPEN_QUOTE + primary_value + CLOSED_QUOTE + CLOSED_PARAN + SEMI + LINEBR)
			db_access.write(TAB + DB_ACCESS_WHEN + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + internal_create_function_name + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + DB_ACCESS_SPREAD + LINEBR)
			db_access.write(TAB + TAB + DB_ANONYMOUS_CALLBACK + DB_FIRST_RESULT + DOT + primary_value.lower() + SEMI + LINEBR)
			db_access.write(TAB + TAB + CLOSED_BRACKET + COMMA + LINEBR)
			db_access.write(TAB + TAB + DB_ERROR + LINEBR)
			db_access.write(CLOSED_BRACKET + LINEBR + LINEBR)





			foreign_join = ""
			for foreign_reference in foreign_reference_array:
				foreign_table = str(foreign_reference["foreignTable"])
				foreign_join += TAB + TAB + DB_ACCESS_JOIN + OPEN_PARAN + OPEN_QUOTE + foreign_table + CLOSED_QUOTE + COMMA + NULL + COMMA + OPEN_QUOTE + foreign_table + DOT
				foreign_join += str(foreign_reference["foreignValue"]) + EQUAL + table_name + DOT + str(foreign_reference["name"]) + CLOSED_QUOTE + CLOSED_PARAN
				if foreign_reference != foreign_reference_array[len(foreign_reference_array)-1]:
					foreign_join += LINEBR

			db_access.write(DB_EXPORTS + DB_GET + by_primary_value + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_GET + by_primary_value + OPEN_PARAN + primary_value + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + VAR + object_name.lower() + EQUAL + DB_ACCESS_SQUEL_SELECT + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_FROM + OPEN_PARAN + OPEN_QUOTE + table_name + CLOSED_QUOTE + CLOSED_PARAN + LINEBR)
			db_access.write(foreign_join + LINEBR)

			db_access.write(TAB + TAB + DB_ACCESS_WHERE + OPEN_PARAN + OPEN_QUOTE + primary_value + EQUAL + "?" + CLOSED_QUOTE + COMMA + primary_value + CLOSED_PARAN + SEMI + LINEBR)
			db_access.write(TAB + DB_ACCESS_WHEN + LINEBR)
			db_access.write(TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + object_name.lower() + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + DB_ACCESS_SPREAD + LINEBR)
			db_access.write(TAB + TAB + DB_ANONYMOUS_CALLBACK + SEMI + LINEBR)
			db_access.write(TAB + CLOSED_BRACKET + COMMA + LINEBR)
			db_access.write(TAB + TAB + DB_ERROR + LINEBR)
			db_access.write(CLOSED_BRACKET + LINEBR + LINEBR)

			db_access.write(DB_EXPORTS + DB_UPDATE + object_name + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_UPDATE + object_name + OPEN_PARAN + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + VAR + DB_UPDATE.lower() + object_name + EQUAL + DB_ACCESS_SQUEL_UPDATE + LINEBR)
			db_access.write(TAB + TAB + TAB + TAB + DB_TABLE + OPEN_PARAN + OPEN_QUOTE + object_name + CLOSED_QUOTE+ CLOSED_PARAN + LINEBR)
			db_access.write(TAB + DB_QUERY_OBJECT + LINEBR + TAB + DB_PROP_FOR + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + TAB + BEGIN_IF + PROP + OR_FALSE + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + JS_EQUAL + FALSE + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
			db_access.write(TAB + TAB + TAB + SET_QUERY_OBJECT + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + SEMI + LINEBR + TAB + TAB + CLOSED_BRACKET + LINEBR)
			db_access.write(TAB + CLOSED_BRACKET + LINEBR)
			db_access.write(TAB + TAB + QUERY_LENGTH_STATEMENT + LINEBR)
			db_access.write(TAB + TAB + TAB + DB_UPDATE.lower() + object_name + EQUAL + DB_UPDATE.lower() + object_name + DB_SET_FIELDS + LINEBR)
			db_access.write(TAB + TAB + TAB + TAB + TAB + TAB + DB_ACCESS_WHERE + OPEN_PARAN + OPEN_QUOTE + primary_value + EQUAL + "?" + CLOSED_QUOTE + COMMA + object_name + DOT + primary_value + CLOSED_PARAN + SEMI + LINEBR)
			db_access.write(TAB + TAB + TAB + DB_ACCESS_WHEN  + LINEBR)
			db_access.write(TAB + TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + DB_UPDATE.lower() + object_name + CLOSED_PARAN + LINEBR)
			db_access.write(TAB + TAB + TAB + DB_ACCESS_SPREAD + LINEBR)
			db_access.write(TAB + TAB + DB_ANONYMOUS_CALLBACK + SEMI + LINEBR)
			db_access.write(TAB + TAB +  CLOSED_BRACKET + COMMA + LINEBR)
			db_access.write(TAB + TAB +  DB_ERROR + LINEBR)
			db_access.write(TAB + TAB + TAB + CLOSED_BRACKET + LINEBR + TAB + CLOSED_BRACKET + LINEBR + LINEBR)

			for val in foreign_reference_array:
				temp_var_name = DB_GET.lower() + val["foreignTable"] + BY + object_name
				db_access.write(DB_EXPORTS + DB_GET + remove_s(str(val["foreignTable"])) + BY + object_name + EQUAL + DB_ACCESS_FUNCTION_BEGIN + SPACE + DB_GET + val["foreignTable"] + BY + object_name + OPEN_PARAN + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
				db_access.write(TAB + temp_var_name + EQUAL + DB_ACCESS_SQUEL_SELECT + LINEBR)
				db_access.write(TAB + TAB + TAB + TAB + DB_ACCESS_FROM + OPEN_PARAN + OPEN_QUOTE + val["foreignTable"] + CLOSED_QUOTE + CLOSED_PARAN + LINEBR)
				db_access.write(TAB + TAB + TAB + TAB + DB_ACCESS_JOIN + OPEN_PARAN + OPEN_QUOTE + object_name + CLOSED_QUOTE + COMMA + SPACE + NULL + COMMA + SPACE + OPEN_QUOTE)
				db_access.write(object_name + DOT + val["name"].lower() + EQUAL + val["foreignTable"] + DOT + val["name"] + CLOSED_QUOTE + CLOSED_PARAN + SEMI + LINEBR)
				db_access.write(TAB + DB_PROP_FOR + object_name + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
				db_access.write(TAB + TAB + BEGIN_IF + PROP + OR_FALSE + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + JS_EQUAL + "false" + CLOSED_PARAN + OPEN_BRACKET + LINEBR)
				db_access.write(TAB + TAB + TAB + temp_var_name + EQUAL + temp_var_name + CLONE_WHERE + object_name + OPEN_ARRAY + PROP + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
				db_access.write(TAB + TAB + CLOSED_BRACKET + LINEBR + TAB + CLOSED_BRACKET + LINEBR + TAB + DB_ACCESS_WHEN + LINEBR + TAB + TAB + TAB + DB_ACCESS_QUERY + OPEN_PARAN + temp_var_name + CLOSED_PARAN + LINEBR)
				db_access.write(TAB + TAB + TAB + DB_ACCESS_SPREAD +LINEBR + TAB + TAB + DB_ANONYMOUS_CALLBACK + SEMI + LINEBR + TAB + TAB + CLOSED_BRACKET + COMMA + LINEBR)
				db_access.write(TAB + TAB + DB_ERROR + LINEBR + CLOSED_BRACKET + LINEBR + LINEBR)







def main():
	# if len(sys.argv) < 4:
	# 	filepath = raw_input("Please provide an absolute filepath for the JSON:\n")
	# 	shell_path = raw_input("Please provide an absolute filepath for the shell script:\n")
	# 	directory = raw_input("Please provide an absolute filepath to create your new REST API:\n")
	# else:
	# 	filepath = sys.argv[1]
	# 	shell_path = sys.argv[2]
	# 	directory = sys.argv[3]

	filepath = "~/Downloads/data (1).json"
	shell_path = "./node/node.sh"
	directory = "./test"

	if "~" in filepath:
		filepath = os.path.expanduser(filepath)

	if "~" in shell_path:
		shell_path = os.path.expanduser(shell_path)

	if "~" in directory:
		directory = os.path.expanduser(directory)

	sql_schema(filepath, shell_path, directory)
	#sql_access(filepath, directory)
main()