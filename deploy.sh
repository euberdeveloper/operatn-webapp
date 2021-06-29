#!/bin/bash

echo "Build site"
npm run build
rm -rf node_modules src public

echo "Removing any pre-existing static file"
cd site
rm -rf *
cd ..

echo "Passing all the new static files from dist to site"
cp dist/* site -rf
