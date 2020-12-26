import React from "react";
import { Link } from "react-router-dom";
import styles from '../styles/info.module.scss';

export default function Help() {
    return <div className={styles.textContainer}>
        <h1 className={styles.header}>
            Frequently Asked Questions
        </h1>

        <p>
            This page is mostly intended for students. If you're a member of staff and you have questions about PalCode,
            please contact contact@palcode.dev.
        </p>

        <h2>
            How do you get my details?
        </h2>
        <p>
            Have you ever seen a 'Sign in with Google' button on the internet?
            PalCode uses similar tech, but plugs straight into your school account instead.
        </p>
        <p>
            Your name and username are imported from your school's database, and you can't change them.
            PalCode will only get your details once you consent to it.
        </p>
        <p>
            See our <Link to='/privacy'>privacy policy</Link> for more info.
        </p>

        <h2>
            I can't log in!
        </h2>
        <p>
            On disastrously slow internet connections, PalCode can sometimes fail to start the authentication process.
            Try <em>not</em> using a slow connection.
        </p>
        <p>
            If it still doesn't work, make sure pop-ups are enabled. Although this shouldn't technically be necessary,
            it could help. Finally, ensure you're using a modern browser (preferably Google Chrome).
        </p>

        <h2>
            Where are my classrooms?
        </h2>
        <p>
            Your teacher will add you to your classrooms using your username — you can't join classrooms yourself.
            If you can't see any classrooms, please ask your teacher to double-check if they have added you correctly.
        </p>

        <h2>
            Why can't I delete my private projects?
        </h2>
        <p>
            Similarly to how you can't delete messages on Microsoft Teams, PalCode doesn't let you delete projects.
            This is just to keep a log of your activities for safeguarding purposes — always keep in mind that your school
            can see your activity.
        </p>

        <h1>
            Editing code
        </h1>

        <h2>
            What's the README.md file?
        </h2>
        <p>
            You'll see this file in your private projects. You can use it to write notes/documentation about your code
            for your personal reference. You can use Markdown to format text.
        </p>

        <h2>
            How do I use PyPI/NPM modules?
        </h2>
        <p>
            Just import them! When you run your code, PalCode will magically find any imported modules in your code,
            and install them for you.
        </p>
        <p>
            The requirements.txt (or any other manifest) file is practically read-only. You can edit it, but it will
            always get overwritten with these automatically-discovered imports when you run your code.
        </p>

        <h2>
            Can I add multiple files?
        </h2>
        <p>
            Yep! Feel free to add as many files as you want, and import them into eachother. The full range
            of module functionality is available in all languages.
        </p>

        <h2>
            Why is my code so slow?
        </h2>
        <p>
            Sorry about that — PalCode runs on a server with limited resources. Your school can select a different
            subscriptions which specifies how much compute power each student gets. The more they pay, the faster your
            code will run.
        </p>

        <h2>
            Why did my code randomly stop?
        </h2>
        <p>
            PalCode puts a time limit on your code to prevent abandoned containers. Not doing so would introduce a few
            problems, such as unnecessary load caused by abandoned containers
        </p>
    </div>
}
