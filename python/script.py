import sys, os, json

#Constants
def sql_schema(filepath):
	FIRST_LINE = """DROP SCHEMA public CASCADE;\n
	CREATE SCHEMA public;\n
	GRANT ALL ON SCHEMA public TO postgres;\n
	GRANT ALL ON SCHEMA public TO public;\n"""
	CREATE_TABLE_BEGIN = "create table "
	CREATE_CUSTOM_BEGIN = "create type "
	AS_ENUM = " as enum "
	OPEN_QUOTE = "'"
	CLOSED_QUOTE = "'"
	OPEN_PARAN = "("
	CLOSED_PARAN = ")"
	SEMI = ";"
	SPACE = " "
	COMMA = ","
	PRIMARY_KEY = "primary key "
	FOREIGN_KEY = "foreign key"
	REF = " references "
	LINEBR = "\n";
	# filepath = '/home/zack/Downloads/data (6).json'
	# if len(sys.argv) > 1:
	# 	filepath = sys.argv[1]

	with open(filepath) as data_file:
		data = json.load(data_file);

	db_arch = open('db_architecture.sql', 'w+')
	db_arch.write(FIRST_LINE + LINEBR + LINEBR)

	for table in data:
		if "type" in table and table["type"] == "Custom":
			db_arch.write(CREATE_CUSTOM_BEGIN + table["name"] + AS_ENUM + OPEN_PARAN)
			for value in table["values"]:
				if value != table["values"][len(table["values"])-1]:
					db_arch.write(OPEN_QUOTE + value + CLOSED_QUOTE + COMMA)
				else:
					db_arch.write(OPEN_QUOTE + value + CLOSED_QUOTE + CLOSED_PARAN + SEMI + LINEBR + LINEBR)

		else:
			db_arch.write(CREATE_TABLE_BEGIN + table["name"] + OPEN_PARAN + LINEBR)
			primary = None
			foreign = []

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


def main():
	if len(sys.argv) == 1:
		filepath = input("Please provide a filepath for the JSON:\n")
	else:
		filepath = sys.argv[0]
		sql_schema(filepath)

main()


