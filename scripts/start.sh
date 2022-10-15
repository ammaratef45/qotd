#!/bin/bash
cd /var/qotd
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
npm install
nohup node app.js > log.out 2>&1 &