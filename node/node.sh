#!/bin/sh

npm install express-generator
express $1 -e --view=ejs
cd $1
npm install
npm install pg -S
npm install squel -S
npm install pg-query -S
npm install when -S