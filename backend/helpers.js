module.exports = {
    getPythonTag() {
        return process.env.PAL_PYTHON_VERSION || '3.8.2';
    },
    getStorageRoot() {
        return process.env.PAL_STORAGE_ROOT;
    }
}
