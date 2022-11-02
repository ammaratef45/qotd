#!/bin/bash
export FOLDER=/var/qotd
pkill -f app.js

if [ -d $FOLDER ]
then
 rm -rf $FOLDER
fi

mkdir -p $FOLDER
