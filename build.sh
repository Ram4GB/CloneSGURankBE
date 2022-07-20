#!/usr/bin/bash

# check if public folder exists
echo "- Check folder if it exists"
if test -d "./public"
then
  echo "- File public folder exists"
  echo "- Trying to remove old public folder"
  rm -rf public
  echo "- Public folder was removed"
fi

# create new public folder & add README.md
mkdir public
touch ./public/README.md
echo "My name is Ram4GB" >> ./public/README.md
cat ./public/README.md

echo "- Finished. Now run ``npm run deploy``"

# check if Api folder exists
echo "- Check folder if it exists"
if test -d "./api"
then
  echo "- File api folder exists"
  echo "- Trying to remove old api folder"
  rm -rf api
  echo "- Api folder was removed"
  echo "- Create api folder"
fi

mkdir api

# copy file index.js to api index.js
echo "- Move file in dist to api"
cp -a dist/. api/
echo "- Move successfully"

ls ./api -la

echo "- Done everythings!!!"
