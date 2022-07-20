# SGU Crawl API

## Dev

1. Compile and build to single index.js by running this command

``
npm run dev:webpack
``

2. Serve server that use compiled code above. Everything now is in 1 file.

``
npm run serve
``

## Build

Prebuild local and deploy to vercel. (This command is now outdated.)

``
npm run vercel:deploy
``

The vercel allow us to deploy server, but when you push new commit, IT WILL NOT SERVE YOUR LATEST CODE. So best solution here is delete your project on Vercel and try to create it again with old name. The build works fine with common express, but now we are using webpack, it is a exception case.

## Why do we use Firebase instead of write file to current server?

Because we are using Vercel hosting, It not allow us to write file

## Check lint before pushing code

``
npm run lint
``

## Vercel deploy

In Vercel, we have to generate API folder for them to make theme serve our server. After run build, the bundle file was created at dist folder. Sometimes, I use optimization options to bundle and it will generate some mapping file or split our library to another file like 717.js which contains our libray. So we need to move all the exist files in dist to api folder. That why I have to create build.sh

## Noted

- This is the branch to test ftp instead of using full functionality of firebase, reduce reading

- One issue is deleting of document in firebase, it cannot be sync on hosting where we use to locate our website and store files.

- I do not maintain ftp branch anymore, maybe firebase is enough for us right now, but if new code owner can keep working on this branch to finish this.

