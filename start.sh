#!/usr/bin/env bash
while [ ! -s src/index.js ]
  do
  printf ""
done
echo "found src"
while [ ! -s public/index.html ]
  do
  printf ""
done
echo "found public"
npm run build
npm install -g pushstate-server
pushstate-server build 8000

