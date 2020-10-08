const fs = require("fs");
const path = require("path");
const {getPythonTag, getStorageRoot} = require("../helpers");
const Docker = require("dockerode");
const docker = Docker();
const uuid = require("uuid").v4;
const sanitize = require("sanitize-filename");

docker.pull('python:' + getPythonTag(), (err, stream) => {
    docker.modem.followProgress(stream, () => {
        console.log('Python installed!');
    }, (event) => {
        console.log(event.status);
    })
});

async function execPython(projectId, socket, io) {
    io.to(projectId).emit('run', {
        status: 200,
        message: 'Starting...'
    });

    docker.createContainer({
        Image: 'python:' + getPythonTag(),
        name: projectId,
        WorkingDir: '/usr/src/app',
        Binds: [
            '/var/run/docker.sock:/var/run/docker.sock',
            path.resolve(getStorageRoot(), sanitize(projectId)) + ':/usr/src/app',
        ],
        Entrypoint: ["python", "index.py"],
        OpenStdin: true,
        Tty: true,
    }, (err, container) => {
        if (err) {
            io.to(projectId).emit('run', {
                status: 500,
                message: 'Run failed. Try again.',
                running: false,
            });
            return;
        }

        io.to(projectId).emit('run', {
            status: 200,
            message: 'Container created! Mounting...',
            running: true,
        });

        container.start();
        container.attach({
            stream: true,
            stdout: true,
            stderr: true,
        }, (err, stream) => {
            stream.on('data', (chunk) => {
                const stdout = chunk.toString('utf8');
                const stdoutID = uuid();
                io.to(projectId).emit('run', {
                    status: 200,
                    stdout,
                    stdoutID,
                    running: true,
                });
            });

            stream.on('end', () => {
                io.to(projectId).emit('run', {
                    status: 200,
                    running: false,
                });
            });
        });
    });
}

async function containerStdin(projectId, stdin) {
    const container = docker.getContainer(projectId);
    container.attach({
        stream: true,
        stdin: true,
        hijack: true,
    }, (err, stream) => {
        stream.write(stdin, () => {
            stream.end();
        });
        return container.wait();
    });
}

async function containerStop(projectId) {
    try {
        await docker.getContainer(projectId).remove({
            force: true,
        });
    } catch (e) {}
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('start', async (data) => {
            if (!data.projectId) {
                socket.emit('run', {
                    status: 400,
                });
                return;
            }

            const dirExists = fs.existsSync(
                path.resolve(getStorageRoot(), sanitize(data.projectId))
            );
            if (!dirExists) {
                socket.emit('run', {
                    status: 404,
                });
                return;
            }

            await containerStop(data.projectId);

            // ensure we aren't broadcasting any other projects
            // this function is undocumented (?) but does exist: https://github.com/socketio/socket.io/blob/1decae341c80c0417b32d3124ca30c005240b48a/lib/socket.js#L287
            socket.leaveAll();

            socket.join(data.projectId);
            io.to(data.projectId).emit('run', {
                status: 200,
                running: true,
                // ansi seq for clearing terminal
                // see https://stackoverflow.com/questions/37774983/clearing-the-screen-by-printing-a-character
                stdout: '\033[2J\033[H',
                stdoutID: 'cls',
            });
            execPython(data.projectId, socket, io);
        });

        socket.on('stdin', (data) => {
            if (!data.projectId || !data.stdin) {
                socket.emit('run', {
                    status: 400,
                });
                return;
            }

            containerStdin(data.projectId, data.stdin);
        });

        socket.on('stop', (data) => {
            if (!data.projectId) {
                socket.emit('run', {
                    status: 400,
                });
                return;
            }

            containerStop(data.projectId);
        });
    });
}
