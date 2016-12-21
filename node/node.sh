#!/bin/sh

npm install express-generator
if [ ! -d $1]; then
	mkdir $1
fi

express $1 --view=ejs
cd $1
npm install