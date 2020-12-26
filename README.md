# PalCode
The open-source replacement to Repl.it Classrooms.

## License
PalCode is distributed under the MIT license. Please see LICENSE.md for more information.

## Building
A typical build takes about 5 minutes, so to avoid a massive CI bill, builds are on a manual schedule, and can be triggered through [the Actions dashboard](https://github.com/palkerecsenyi/palcode/actions?query=workflow%3ACI).

## Development
To run PalCode locally, first add a DNS alias for `palcode.local` to `127.0.0.1`.

Then, set [some environment variables](https://github.com/palkerecsenyi/palcode/blob/master/.github/workflows/main.yml) as shown in the workflow config.
Feel free to use your own values here.

Next, [download Docker CE](https://docs.docker.com/get-docker/) for your computer. It's available for all operating systems.

Finally, start the script:

```shell script
# terminal 1
yarn run start
```

Your browser will automatically be opened to the frontend, and you'll need to wait up to 2 minutes for the page to load, as the first build takes a while to complete. From then on, changes you make to the code will automatically be refreshed in your browser.
