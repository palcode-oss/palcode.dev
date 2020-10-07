# PalCode
The free replacement for Repl.it Classrooms.

## Building
https://palcode.dev is hosted via a DigitalOcean Droplet. Because building React requires tons of memory (for some reason), this isn't done on the Droplet, but instead by GitHub's CI, which auto-scales memory.

A typical build takes about 5 minutes, so to avoid a massive CI bill, builds are on a manual schedule, and can be triggered through [the Actions dashboard](https://github.com/palkerecsenyi/palcode/actions?query=workflow%3ACI).

There's a script on the Droplet (`/opt/palcode/install-build.sh`) which uses the GitHub API to download a build artifact created by the CI as a zip. To run it, first modify the artifact ID inside it (you can get this by copying the link in the Actions dashboard), and then run `./install-build.sh`. Then, just extract the zip into an empty `build` directory.

Node.js is run by PM2. When backend changes have been pulled, run `pm2 restart palcode` to propagate them.

You may need to run `yarn run install` to update packages.

## Running on your own server


## Development
To run PalCode locally, first set some environment variables:

- `PAL_STORAGE_ROOT` - a read/writeable directory to store user code and files in
- `PAL_PORT` - the port to run the server on. Make sure this is different to your React development port (3000 by default)
- `REACT_APP_API` - set this to `http://localhost:<your server port>/api`
- `REACT_APP_SOCKET` - set this to `http://localhost:<your server port>`

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

When running this for the first time, you'll notice that Terminal 2 installs the [Python Docker environment](https://hub.docker.com/_/python). This download is about 300MB and is necessary to run Python code. You don't need to do anything - the download is fully automatic. However, you won't be able to run code until the installation has completed.
