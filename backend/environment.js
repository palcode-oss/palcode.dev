const fs = require("fs");
const path = require("path");
const nodeHtml = require("node-html-parser");

const env = Object.keys(process.env).filter(e => e.startsWith('REACT_APP_'));
const frontendConfig = {};
env.forEach(variable => {
    frontendConfig[variable.split('REACT_APP_')[1]] = process.env[variable];
});

const html = fs.readFileSync(path.resolve('build', 'index.html'), 'utf8');
const parsedHtml = nodeHtml.parse(html);
try {
    parsedHtml.querySelector('#PalConfig').set_content(
        'window.PalConfig = ' + JSON.stringify(frontendConfig),
    );
} catch (e) {}

module.exports = parsedHtml.toString();
