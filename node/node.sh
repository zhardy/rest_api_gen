#!/bin/sh

npm install express-generator
express $1 -e --view=ejs
cd $1
npm install