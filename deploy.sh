#!/bin/sh

echo "Removing any pre-existing static file"
cd site
rm -r *
cd ..

echo "Building frontend"
npx http-server site
