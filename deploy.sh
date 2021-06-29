#!/bin/bash

echo "Removing any pre-existing dist"
rm -rf dist

echo "Building frontend"
npm run build

echo "Removing node modules and source code"
rm -r node_modules src

echo "Installing dep for http static debug server"
npm install -D http-server

echo "Running debug server"
npx http-server dist
