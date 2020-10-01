const fs = require("fs");
const path = require("path");
const Docker = require("dockerode");
const docker = Docker();

const storageRoot = process.env.PAL_STORAGE_ROOT;

docker.pull('python:3.7.9', (err, stream) => {
    console.log('Installing Python 3.7.9');
    docker.modem.followProgress(stream, (err, output) => {
        console.log('Python 3.7.9 installed!');
    }, (event) => {
        console.log(event.status);
    })
});

async function execPython(projectId, socket, io) {
    io.to(projectId).emit('run', {
        status: 200,
        message: 'Starting...'
    });

    try {
        await docker.getContainer(projectId).remove({
            force: true,
        });
    } catch (e) {}

    docker.createContainer({
        // repl.it uses python 3.7.x
        Image: 'python:3.7.9',
        name: projectId,
        WorkingDir: '/usr/src/app',
        Binds: [
            '/var/run/docker.sock:/var/run/docker.sock',
            path.resolve(storageRoot + '/' + projectId) + ':/usr/src/app',
        ],
        Entrypoint: ["python", "index.py"],
        OpenStdin: true,
        Tty: true,
    }, (err, container) => {
        if (err) {
            io.to(projectId).emit('run', {
                status: 500,
                message: 'Run failed. Try again.'
            });
            return;
        }

        io.to(projectId).emit('run', {
            status: 200,
            message: 'Container created! Mounting...'
        });

        container.start();
        container.attach({
            stream: true,
            stdout: true,
            stderr: true,
        }, (err, stream) => {
            stream.on('data', (chunk) => {
                const stdout = chunk.toString('utf8');
                io.to(projectId).emit('run', {
                    status: 200,
                    stdout,
                });
            });

            stream.on('end', () => {
                io.to(projectId).emit('run', {
                    status: 200,
                    end: true,
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

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('start', (data) => {
            if (!data.projectId) {
                socket.emit('run', {
                    status: 400,
                });
                return;
            }

            const dirExists = fs.existsSync(
                path.resolve(storageRoot + '/' + data.projectId)
            );
            if (!dirExists) {
                socket.emit('run', {
                    status: 404,
                });
                return;
            }

            socket.join(data.projectId);
            io.to(data.projectId).emit('run', {
                status: 200,
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
        })
    });
}
