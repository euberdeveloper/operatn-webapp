#!/bin/bash

echo "Build site"
npm run build
rm -r node_modules src public

echo "Removing any pre-existing static file"
cd site
rm -r *
cd ..

echo "Passing all the new static files from dist to site"
cp dist/* site -r
