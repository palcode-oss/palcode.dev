# Setting up on a server

## Minimum server specifications
- Linux (Ubuntu 20.04 LTS recommended)
    - PalCode uses cross-platform software that can run on Windows and Mac servers, but Ubuntu Server is recommended for best performance.
- 1GB RAM
- 10GB high-speed storage (SSD recommended)
- High-speed internet connection

## Installing prerequisites
All the following commands assume you are root.

### Python
To optionally set up a language server for Python, see [the PalCode Language Server's docs](https://github.com/palkerecsenyi/palcode-lsp#the-palcode-language-server).

### Docker
Docker is responsible for running Python instances in containers that have hard resource limits and fully secure system isolation.

```shell script
apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```

```shell script
apt update
apt-cache policy docker-ce
apt install docker-ce
```

#### Installing code images
You need to install images for each language you want PalCode to work with. If you don't install an image, and you try running a project in that language, the server may crash.

Currently, PalCode supports the following languages:

* Python (Docker image: `python`, default version 3.9.1)
* Node.JS (Docker image: `node`, default version 14.15.1)

You can set the tag for the server to use using the `PAL_<UPPERCASE_LANGUAGE>_VERSION` environment variables. For example, you could set `PAL_PYTHON_VERSION` to `3.9.1`. If a version doesn't have a matching environment variable, the aforementioned default values will be assumed. Once again, if no image is found for the specified/default version, PalCode will crash.

For any language you use, you'll also need to install the image via Docker. This is pretty easy:

```shell script
docker pull <docker image>:<version>
```

For example, as a bare minimum, you'll need to install Python:

```shell script
docker pull python:3.9.1
```

### Node.js and Yarn
PalCode's backend runs on the [Node.js](https://nodejs.org/en/) platform, a high-performance backend JavaScript runtime. Here's how to install the latest LTS version using NVM (Node Version Manager):

```shell script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

source ~/.bashrc

nvm install --lts
```

Running `node -v` and `npm -v` should both give coherent version numbers.

Node.js comes bundled with a package manager known as NPM. Because this is notoriously slow, PalCode uses an improved version known as [Yarn](https://yarnpkg.com/). To install this globally, run:

```shell script
npm install -g yarn
```

### PM2
[PM2](https://pm2.keymetrics.io/) is a widely-used process manager for Node.js. It automatically restarts the runtime should it exit, and automatically handles process forking and load balancing. Installing it is straightforward:

```shell script
npm install -g pm2
```

A cool feature of PM2 is that it supports monitoring the Node.js instance in realtime. Visit [pm2.io](https://pm2.io) to set up an online dashboard for free with a single command.

## Cloning PalCode
PalCode can technically be placed wherever you want on the filesystem. However, in keeping with [Linux conventions](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/opt.html), it's recommended to clone it into `/opt/palcode`.

```shell script
cd /opt
git clone https://github.com/palkerecsenyi/palcode
```

## Installing dependencies
The `package.json` file contains a huge list of dependencies and their [Semver](https://semver.org/) version numbers. Some of these are required for building the frontend using Typescript and Webpack, and some are required for the backend runtime.

To install all the necessary dependencies, just run:

```shell script
yarn install --frozen-lockfile
```

## Installing the frontend build
This process must be done manually every time you want to update the frontend. To make it easier, it's best to save a Shell script to do it for you. This isn't bundled with the repository, as it needs to contain a sensitive GitHub user access key.

Here's a template:

```shell script
# install-build.sh

rm build.zip
read -p "Enter artifact ID: " artifactid
curl -s -I -H "Accept: application/vnd.github.v3+json" -H "Authorization: token <INSERT YOUR GITHUB TOKEN HERE>" https://api.github.com/repos/palkerecsenyi/palcode/actions/artifacts/$artifactid/zip | grep -Fi Location: | sed -e "s/^Location: //" | xargs wget -O build.zip
rm -rf build
mkdir build
unzip build.zip -d build
rm build.zip
```

To create the file:

```shell script
cd /opt/palcode
nano install-build.sh

# paste the file contents
# press ctrl+x
# type 'y'
# press enter

chmod +x install-build.sh
```

To run it, first get the artifact ID from GitHub. This can be done by copying the address of an artifact download link (from [this page](https://github.com/palkerecsenyi/palcode/actions/runs/296950498), for example), and taking the last section of the copied URL (after `/artifacts`).

Then, in the console, run:

```shell script
./install-build.sh
```

```shell script
$ Enter artifact ID: # <paste id here>
```

The build will be installed and unzipped automatically. Please note that this script deletes the `build` directory, so between the start and finish of the script, the website will be temporarily unavailable.

## Setting environment variables
PalCode uses a few backend environment variables that you need to set. Any variables prepended with `REACT_APP_` are delivered to the frontend by injecting them into a script tag.

- `PAL_<language>_VERSION` - the Docker image tag of each supported language to use. Must be installed on the system.
- `PAL_STORAGE_ROOT` - the directory to store user data. Cannot be a relative path. Must have read-write access for the `root` user.
- `PAL_PORT` - the port to run PalCode's HTTPS server on. Must be [`443`](https://www.grc.com/port_443.htm) in a production environment.
- `PAL_HOST` - the FQDN of the only valid URL from which PalCode can be accessed. All other requests will be redirected.
- `NODE_ENV` - the environment being used. Must be `production` or `development`. To enable HTTPS, this must be `production`.
- `REACT_APP_API` - set this to `http://localhost:<your server port>/api`. Defines the base URL for frontend API requests.
- `REACT_APP_XTERM` - set this to `http://localhost:<your server port>`. Defines the base URL for Xterm's stdin/stdout container management.
- `REACT_APP_LSP` - set this to `wss://lsp.palcode.dev`. Defines the base URL for WebSocket language server requests. As this doesn't store code server-side for any extended time period, feel free to use lsp.palcode.dev (a real, hosted LSP server maintained by Pal) in production, too. If you want your own, use [this repo](https://github.com/palkerecsenyi/palcode-lsp) as a base. PalCode will work without a language server, but cool things like real-time code checking, refactoring, and style guidance won't be available.
- `REACT_APP_TENANT` - the Azure AD tenant ID to allow users from. [This website](https://www.whatismytenantid.com/) is very helpful for finding this. No admin access is required to find this ID, and using it poses no security risk to the institution to which the ID belongs. It's merely a frontend-only OAuth identifier that Microsoft uses to customise and filter the login page. Sign-ins from accounts not belonging to this tenant ID will be rejected by Microsoft.
- `REACT_APP_F_*` - a few variables to configure the frontend Firebase connection. An example is available in [`.github/workflows/main.yml`](https://github.com/palkerecsenyi/palcode/blob/master/.github/workflows/main.yml#L31). Same as the variables in the `firebase.initializeApp()` call in [`src/index.js`](https://github.com/palkerecsenyi/palcode/blob/master/src/index.js#L7) but in an uppercase, underscore-delimited form, with `REACT_APP_F_` prepended to each.

The best place to set these variables is at the bottom of `~/.bashrc`. Remember to run `source ~/.bashrc` after modifying the file.

PalCode also accepts a few other **optional** variables to configure resource quotas for Docker containers. To assume the default values, just leave these variables unset. The default values can be found in [`backend/socket/run.js`](https://github.com/palkerecsenyi/palcode/blob/master/backend/socket/run.js#L36) – these numbers are the result of over an hour of tweaking to balance stability with performance. However, feel free to configure them if you have limited or additional server capacity. You can find more details in the [Docker API reference](https://docs.docker.com/engine/api/v1.40/#operation/ContainerCreate).

- `PAL_PID_LIMIT` - the maximum number of processes that can be run inside the container concurrently. Protects against [fork bomb](https://en.wikipedia.org/wiki/Fork_bomb) attacks, which can be done with a [1-line Python script](https://gist.github.com/palkerecsenyi/694d45d5f5cf30fdd65de79257bd1859). *Default: 25*
- `PAL_MEMORY_QUOTA` - the maximum amount of RAM the container can consume, in bytes. Note that this is not a reservation, just a hard limit. *Default: 104857600* (100 megabytes)
- `PAL_DISK_QUOTA` - the maximum amount of disk space the container can consume, in bytes. Again, this is not a reservation. Docker doesn't fully support this feature yet, so disk quota limiting may not work in practice. *Default: 52428800* (50 megabytes)
- `PAL_CPU_QUOTA` - the maximum amount of CPU cores the container can use, in units of 10^-9 cores. Again, this is not a reservation. This [Python Pi calculator](https://gist.github.com/palkerecsenyi/ec4642f28c7cba9f2dac613b62a6adb2) is useful for testing this (try >10000 digits). *Default: 200000000* (0.20 cores)
- `PAL_TIMEOUT` - the maximum amount of time a Python script can run for, in integer minutes. Protects against [infinite loop](https://cwe.mitre.org/data/definitions/835.html) attacks. Note that this refers to running time in general, not just processing time. If an `input()` is called, and the user does nothing for this amount of time, the script will stop abruptly. *Default: 15*

## TLS
PalCode's original implementation uses two-way strict TLS encryption. This involves a Cloudflare Origin CA certificate being used on the server. Cloudflare uses this to verify the server's identity, but uses a different certificate to serve the page to the public.

Using Cloudflare with this configuration is highly secure, and completely free of charge. Generating an Origin CA certificate is [easy](https://support.cloudflare.com/hc/en-us/articles/115000479507-Managing-Cloudflare-Origin-CA-certificates#h_30e5cf09-6e98-48e1-a9f1-427486829feb).

Whatever certificate configuration you use, the `key.pem` and `cert.pem` files must be placed directly in the PalCode install directory (in this case `/opt/palcode`). These files are in `.gitignore`, so they'll never be committed by accident.

## Firebase service account
PalCode's backend needs a Firebase service account certificate, primarily for handling large database operations like cloning a classroom. You can [generate one online](https://firebase.google.com/docs/admin/setup#initialize-sdk).

There's no need to set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable – instead, place the service account file directly in the `/opt/palcode` directory, with the name `serviceAccount.json`. This is in the `.gitignore` list.

## Running PalCode
Finally, you get to run PalCode. This is really easy:

```shell script
cd /opt/palcode
pm2 start backend/index.js --name palcode
```

To check that everything is working, you can check the Node.js logs:

```shell script
pm2 logs
# press ctrl+c to exit
```

You should now be able to access PalCode.

## Restarting
You can restart PalCode with a single command:

```shell script
pm2 restart palcode
```

To propagate environment variable updates, add the `--update-env` flag:

```shell script
pm2 restart palcode --update-env
```

## Configuring a firewall
On a pristine Ubuntu server, there's no firewall, and all connections are allowed in and out by default. Fixing this is easy.

Ubuntu comes bundled with `ufw` (Uncomplicated Firewall). PalCode only needs one port in production (443/https). Here's how to set it up.

```shell script
ufw enable
ufw allow https
```

To ensure it's worked, run:

```shell script
ufw status
```
