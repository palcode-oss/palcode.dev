# PalCode
The free replacement for Repl.it Classrooms.

## Building
https://palcode.dev is hosted via a DigitalOcean Droplet. Because building React requires tons of memory (for some reason), this isn't done on the Droplet, but instead by GitHub's CI, which auto-scales memory.

A typical build takes about 5 minutes, so to avoid a massive CI bill, builds are on a manual schedule, and can be triggered through [the Actions dashboard](https://github.com/palkerecsenyi/palcode/actions?query=workflow%3ACI).

There's a script on the Droplet (`/opt/palcode/install-build.sh`) which uses the GitHub API to download a build artifact created by the CI as a zip. To run it, first modify the artifact ID inside it (you can get this by copying the link in the Actions dashboard), and then run `./install-build.sh`. Then, just extract the zip into an empty `build` directory.

Node.js is run by PM2. When backend changes have been pulled, run `pm2 restart palcode` to propagate them.

You may need to run `yarn run install` to update packages.

## Development
To run PalCode locally, first add a DNS alias for `palcode.local` to `127.0.0.1`.

Then, set [some environment variables](https://github.com/palkerecsenyi/palcode/blob/master/SETUP.md#setting-environment-variables).

Next, [download Docker CE](https://docs.docker.com/get-docker/) for your computer. It's available for all operating systems.

Finally, start the two scripts (in separate terminals):

```shell script
# terminal 1
yarn run start
```
```shell script
# terminal 2
yarn run start-server-dev
```

Your browser will automatically be opened to the frontend, and you'll need to wait up to 2 minutes for the page to load, as the first build takes a while to complete. From then on, changes you make to the code will automatically be refreshed in your browser.
