const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount['project_id']}.firebaseio.com`,
});

module.exports = {
    getPythonTag() {
        return process.env.PAL_PYTHON_VERSION || '3.8.2';
    },
    getStorageRoot() {
        return process.env.PAL_STORAGE_ROOT;
    },
    getFirebase() {
        return admin;
    }
}
