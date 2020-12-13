const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount['project_id']}.firebaseio.com`,
});

module.exports = {
    getTag(language) {
        switch(language) {
            case 'python':
                return 'python:' + (process.env.PAL_PYTHON_VERSION || '3.9.1');
            case 'nodejs':
                return 'node:' + (process.env.PAL_NODEJS_VERSION || '14.15.1');
        }
    },
    getLanguageDefaultFile(language) {
        switch (language) {
            case 'python':
                return 'index.py';
            case 'nodejs':
                return 'index.js';
        }
    },
    isValidLanguage(language) {
        return ['python', 'nodejs'].includes(language);
    },
    getStorageRoot() {
        return process.env.PAL_STORAGE_ROOT;
    },
    getFirebase() {
        return admin;
    }
}
