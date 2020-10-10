import React, { ReactElement } from 'react';
import styles from './styles/about.module.scss';
import moment from 'moment';

export default function About(): ReactElement {
    return (
        <>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    <span
                        className={styles.titleSmall}
                    >
                        About
                    </span>PalCode
                </h1>
            </div>

            <div className={styles.textContainer}>
                <h1 className={styles.header}>
                    Why PalCode?
                </h1>

                <p>
                    {moment('2020-06-30').fromNow()}, Repl.it&nbsp;
                    <a
                        href='https://blog.repl.it/teams-for-education'
                        target='_blank'
                    >
                        announced
                    </a>
                    &nbsp;an update to their pricing strategy for their education-oriented Classrooms feature.
                    The service would be re-branded as 'Repl.it Teams', and educational institutions would be
                    charged <strong>$350/year/classroom.</strong>
                </p>

                <p>
                    For a school like MGS, this would leave two options:
                    dedicate a huge budget towards a subscription – taking away money from other important investments, or
                    merging students into fewer classrooms – resulting in a chaotic and unfriendly arrangement.
                </p>

                <p>
                    But of course, there's a third option. Reverse-engineer the entire Repl.it platform from scratch.
                    That's what PalCode is. This way, the total bill comes out to about <strong>£100/year</strong> for unlimited students
                    and classrooms – the only expenses are a domain name and a server.
                </p>

                <h1 className={styles.header}>
                    Reverse-engineering Repl.it
                </h1>

                <p>
                    Though something like Repl.it may seem like a highly complicated and lengthy piece of software, its
                    core functionality is actually based off some really simple tools.
                </p>

                <p>
                    Classrooms contain students and tasks, and each task has submissions created by each student.
                    Each task/submission has a specific folder on the server's filesystem, where all the file contents
                    of it are stored. The server just has to read and write to those files, exchanging data with some simple
                    JavaScript running on the frontend, via HTTP requests.
                </p>

                <h1 className={styles.header}>
                    Open source libraries
                </h1>

                <p>
                    PalCode was made possible by loads of open-source libraries, without which developing the platform
                    would have taken several months. A few of them are summarised here.
                </p>

                <h2>
                    Monaco
                </h2>
                <img
                    alt='The Monaco text editor'
                    src='https://i.ibb.co/F4MCsF2/image.png'
                />
                <p>
                    Monaco is a JavaScript-based code editor, with support for syntax highlighting, auto-completion, theme
                    customisation, and more. It's well-known for its use in&nbsp;
                    <a href='https://code.visualstudio.com/' target='_blank'>
                        VS Code
                    </a>
                    . Code editors are highly complex applications, and creating one from scratch would take ages.
                    Unsurprisingly, Monaco is also used by Repl.it.
                </p>

                <h2>
                    Xterm.js
                </h2>
                <img
                    alt='A preview of the Xterm.js emulator'
                    src='https://i.ibb.co/9tcP2tY/image.png'
                />
                <p>
                    <a
                        href='https://en.wikipedia.org/wiki/Xterm'
                        target='_blank'
                    >
                        Xterm
                    </a>
                    &nbsp;is the most popular terminal emulator in existence, used by almost all Linux distributions,
                    as well as a variety of other UNIX-based systems. It supports some cool features that go beyond
                    basic text I/O, including 8-bit colour and animations.
                </p>
                <p>
                    <a
                        href='https://www.npmjs.com/package/xterm'
                        target='_blank'
                    >
                        Xterm.js
                    </a>
                    &nbsp;emulates the Xterm emulator as a frontend JavaScript library. It includes support for GPU
                    acceleration, automatic linking, themes, and more – all while precisely replicating the functionality
                    of the Xterm emulator.
                </p>

                <h2>
                    Socket.io
                </h2>
                <p>
                    <a
                        href='https://socket.io/'
                        target='_blank'
                    >
                        Socket.io
                    </a>
                    &nbsp;is a high-performance WebSocket wrapper, designed primarily for real-time interaction between frontend
                    JavaScript and Node.js. PalCode uses it to facilitate the stdin and stdout streams of the Xterm
                    emulator, sending each input as an stdin stream to the code runner, and sending the stdout stream
                    back to the browser. It also updates the frontend as to whether the code is running or not.
                </p>
                <p>
                    PalCode uses this instead of a custom WebSocket implementation for the simplicity and high-level
                    abstraction it provides, reducing development time drastically.
                </p>

                <h2>
                    React
                </h2>
                <p>
                    <a
                        href='https://reactjs.org/'
                        target='_blank'
                    >
                        React
                    </a>
                    &nbsp;is an incredibly popular frontend JavaScript library created by Facebook in 2013. Today, its
                    used by practically every website – and that's hardly an exaggeration. PalCode's codebase is completely
                    written using React. It really helps
                </p>
            </div>
        </>
    );
}
