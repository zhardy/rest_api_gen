import os, json
from lxml import etree
from pprint import pprint


with open('/home/zack/Downloads/data.json') as data_file:
	data = json.load(data_file);
for table in data:
	print table["name"]
#print data[0]["values"][0]["isReference"]

# f = open("/home/zack/Downloads/data.json", "r")

# for file in os.listdir("/home/zack/Downloads/"):
# 	print file

# print f.read()