# Setting up on a server

## Minimum server specifications
- Linux (Ubuntu 20.04 LTS recommended)
    - PalCode uses cross-platform software that can run on Windows and Mac servers, but Ubuntu Server is recommended for best performance.
- 1GB RAM
- 10GB high-speed storage (SSD recommended)
- High-speed internet connection

## Installing prerequisites
All the following commands assume you are root.

### Docker
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

#### Installing the Python image
Repl.it currently uses Python 3.8.2. The version of Python used can be configured with the `PAL_PYTHON_VERSION` environment variable. If the environment variable isn't set, PalCode will default to 3.8.2.

When running the server for the first time, Python will be installed automatically. However, it's recommended that you install it now.

```shell script
docker pull python:3.8.2
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
This process must be done manually every time you want to update the frontend. To make it easier, it's best to save a Shell script to do it for you. This isn't bundled with the repository as it needs to contain a GitHub user access key.

Here's a template:

```shell script
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
PalCode uses a few backend environment variables that you need to set.

- `PAL_PYTHON_VERSION` - the [tag of Python](https://hub.docker.com/_/python?tab=tags) to install and use. Will automatically install if not already present on system.
- `PAL_STORAGE_ROOT` - the directory to store user data. Cannot be a relative path. Must have read-write access for the `root` user.
- `PAL_PORT` - the port to run PalCode's HTTPS server on. Must be [`443`](https://www.grc.com/port_443.htm) in a production environment.
- `NODE_ENV` - the environment being used. Must be `production` or `development`. To enable HTTPS, this must be `production`.

The best place to set these variables is at the bottom of `~/.bashrc`. Remember to run `source ~/.bashrc` after modifying the file.

## TLS
PalCode's original implementation uses two-way strict TLS encryption. This involves a Cloudflare Origin CA certificate being used on the server. Cloudflare uses this to verify the server's identity, but uses a different certificate to serve the page to the public.

Using Cloudflare with this configuration is highly secure, and completely free of charge. Generating an Origin CA certificate is [easy](https://support.cloudflare.com/hc/en-us/articles/115000479507-Managing-Cloudflare-Origin-CA-certificates#h_30e5cf09-6e98-48e1-a9f1-427486829feb).

Whatever certificate configuration you use, the `key.pem` and `cert.pem` files must be placed directly in the PalCode install directory (in this case `/opt/palcode`). These files are in `.gitignore`, so they'll never be committed by accident.

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

## Configuring a firewall
On a pristine Ubuntu server, there's no firewall, and all connections are allowed in and out by default. Fixing this is easy.

Ubuntu comes bundled with `ufw` (Uncomplicated Firewall). PalCode only needs one port in production (443). Here's how to set it up.

```shell script
ufw enable
ufw allow https
```

To ensure it's worked, run:

```shell script
ufw status
```
