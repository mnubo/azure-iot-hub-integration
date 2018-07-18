#!/usr/bin/env bash

set -e

DATA_DIR=/data
NODE_MODULES_DIR=/tmp/node_modules_install
ZIP_FILE=${DATA_DIR}/az_mnubo_function.zip

mkdir $NODE_MODULES_DIR

cp $DATA_DIR/package.json $NODE_MODULES_DIR

cd $NODE_MODULES_DIR
npm install
zip -r $ZIP_FILE node_modules

cd $DATA_DIR
zip -rg $ZIP_FILE index.js package.json
