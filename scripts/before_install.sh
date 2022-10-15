#!/bin/bash
export FOLDER=/var/qotd

if [ -d $FOLDER ]
then
 rm -rf $FOLDER
fi

mkdir -p $FOLDER