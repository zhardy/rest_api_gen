import sys, os, json, subprocess


OPEN_QUOTE = "'"
CLOSED_QUOTE = "'"
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
BEGIN_IF = "if("
BY = "By"

ROUTER_FUNCTION_BEGIN = "function(req, res) { "
ROUTER_FUNCTION_END = "}); \n\n"
RES_JSON = "res.json"
RES_INFO = "info: "
MODULE_EXPORTS = "module.exports = router;"


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


def rest_api_gen(filepath, shell_path, location_for_api):
	#subprocess.call([shell_path, location_for_api])
	with open(filepath) as data_file:
		data = json.load(data_file)
	
	for table in data:
		if "type" not in table:
			js_route = open(location_for_api + "/routes/" + table["name"] + ".js", 'w')
			table_name = str(table["name"])
			if str.lower(table_name[len(table_name)-1]) == "s":
				table_name = table_name[0:len(table_name)-1]
			var_declaration = ""
			if_statements_for_requests = ""
			value_array = []


			#get single entry in table based on various info based to the request
			js_route.write(BEGIN_ROUTES + LINEBR + LINEBR)
			js_route.write(ROUTER_GET + table_name + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			for value in table["values"]:
				var_declaration += TAB + VAR + SPACE + value["name"] + SEMI + LINEBR
				if_statements_for_requests += TAB + BEGIN_IF + REQ_BODY + value["name"] + CLOSED_PARAN + OPEN_BRACKET + LINEBR
				if_statements_for_requests += TAB + TAB + value["name"] + EQUAL + REQ_BODY + value["name"] + SEMI + LINEBR
				if_statements_for_requests += TAB + CLOSED_BRACKET + LINEBR + LINEBR
				if str.lower(str(value["name"])).find("id") > -1 and bool(value["isPrimary"]):
					id_value = value["name"]
				value_array.append(value["name"])
			js_route.write(var_declaration)
			js_route.write(if_statements_for_requests)
			js_route.write(TAB + VAR + SPACE + table_name + EQUAL + DB_GET + table_name + OPEN_PARAN + OPEN_ARRAY + ', '.join(value_array) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + table_name + CLOSED_BRACKET + CLOSED_PARAN + LINEBR)
			js_route.write(ROUTER_FUNCTION_END)

			#Get single entry in table based on the primary ID 
			# route developed in the following pattern /{tablename}/{id}	
			js_route.write(ROUTER_GET + table_name + FW_SLASH +  COLON + id_value + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
			js_route.write(TAB + VAR + SPACE + id_value + EQUAL + REQ_PARAM + id_value + SEMI + LINEBR)
			js_route.write(TAB + VAR + SPACE + table_name + EQUAL + DB_GET + table_name + BY + id_value + OPEN_PARAN + id_value + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + table_name + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR)
			js_route.write(ROUTER_FUNCTION_END + LINEBR + LINEBR)
			
			for value in table["values"]:
				if value["isReference"]:
					foreign_reference = str(value["foreignTable"])
					if str.lower(foreign_reference[len(foreign_reference)-1]) == "s":
						foreign_reference = foreign_reference[0:len(foreign_reference)-1]
					js_route.write(ROUTER_GET + table_name + FW_SLASH + foreign_reference + CLOSED_QUOTE + COMMA + SPACE + ROUTER_FUNCTION_BEGIN + LINEBR)
					js_route.write(var_declaration)
					js_route.write(if_statements_for_requests)
					#not a successful deep copy. Need to figure out how to do a successful deep copy in python 
					# second_value_array = value_array
					# second_value_array.remove(value["name"])
					js_route.write(TAB + VAR + foreign_reference + EQUAL + DB_GET + foreign_reference + BY + table_name + OPEN_PARAN + OPEN_ARRAY + ', '.join(value_array) + CLOSED_ARRAY + CLOSED_PARAN + SEMI + LINEBR)
					js_route.write(TAB + RES_JSON + OPEN_PARAN + OPEN_BRACKET + RES_INFO + foreign_reference + CLOSED_BRACKET + CLOSED_PARAN + SEMI + LINEBR)
					js_route.write(ROUTER_FUNCTION_END)
			js_route.write(END_ROUTES)







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
	rest_api_gen(filepath, shell_path, directory)

main()


