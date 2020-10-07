const express = require("express");
const router = express.Router();

const ActiveDirectory = require("activedirectory");
/*const ad = new ActiveDirectory({
    url: process.env.PAL_LDAP_URL,
    baseDN: process.env.PAL_LDAP_DN,
    username: process.env.PAL_LDAP_USERNAME,
    password: process.env.PAL_LDAP_PASSWORD,
});

router.post('/activedirectory', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    ad.authenticate(username, password, (err, auth) => {
        if (err) {
            res.sendStatus(500);
            console.warn(err);
            return;
        }

        if (auth) {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    });
});*/

module.exports = router;
