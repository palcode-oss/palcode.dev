import React from "react";
import styles from './styles/info.module.scss';

export default function Help() {
    return <div className={styles.textContainer}>
        <h1 className={styles.header}>
            Frequently Asked Questions
        </h1>

        <p>
            This page is mostly intended for students. If you're a member of staff and you have questions about PalCode,
            please contact kerecsenyip-y15@mgs.org.
        </p>

        <h1>
            Your account and projects
        </h1>
        <h2>
            How do you get my details?
        </h2>
        <p>
            Have you ever seen a 'Sign in with Google' button on the internet?
            PalCode uses similar tech, but plugs straight into your MGS account instead.
        </p>
        <p>
            Your name and username are imported from MGS' database, and you can't change them.
            PalCode will only get your details once you consent to it.
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
            This is just to keep a log of your activities for safeguarding purposes — always keep in mind that MGS staff
            can see your activity.
        </p>

        <h1>
            Editing code
        </h1>
        <h2>
            What Python version does PalCode use?
        </h2>
        <p>
            Always the latest minor version — we won't upgrade major versions without advance notice.
            Currently, it's using Python 3.9.1.
        </p>

        <h2>
            What's the README.md file?
        </h2>
        <p>
            You'll see this file in your private projects. You can use it to write notes/documentation about your code
            for your personal reference. You can use Markdown to format text.
        </p>

        <h2>
            How do I use PyPI modules?
        </h2>
        <p>
            Just import them! When you run your code, PalCode will magically find any imported modules in your code,
            and install them for you.
        </p>
        <p>
            The requirements.txt file is practically read-only. You can edit it, but it will always get overwritten with
            these automatically-discovered imports when you run your code.
        </p>

        <h2>
            Why do my files keep disappearing?
        </h2>
        <p>
            When you create a new file in the PalCode editor, it stores it in your browser's local memory. The file isn't
            actually created on the server until you put some text in it, and this means that your Python code might think
            the file doesn't exist.
        </p>
        <p>
            To make your file stay there, just put some text in it.
        </p>

        <h2>
            Can I add multiple Python files?
        </h2>
        <p>
            Yep! Feel free to add as many Python files as you want, and import them into eachother. Python's full range
            of module functionality is available.
        </p>

        <h2>
            Why is my code so slow?
        </h2>
        <p>
            Sorry about that — PalCode runs on a server with limited resources. We're trying to figure out the best
            cost-performance balance, and when many people are using PalCode at the same time, load can spike significantly.
        </p>

        <h2>
            Can I abuse PalCode?
        </h2>
        <p>
            No, please don't. PalCode is part of MGS' IT network, so your usage is bound by the Acceptable Use Policy.
            Attempts to use Python code to take down PalCode or compromise user data aren't 'funny' or 'quirky', but
            annoying and, in many cases, heavily illegal. You could get into a lot of trouble for intentionally damaging
            this site.
        </p>
        <p>
            Of course, don't worry if you've accidentally crashed PalCode or found a security vulnerability! It does happen,
            since this website <em>was</em> made by two people in the space of a weekend. Please make a responsible disclosure
            to kerecsenyip-y15@mgs.org if you've found a vulnerability, and don't tell any other students.
        </p>

        <h1>
            Other
        </h1>
        <h2>
            I want to look at PalCode's source code
        </h2>
        <p>
            Sure! A copy of PalCode's latest source code is available in a private GitHub repo. Email kerecsenyip-y15@mgs.org
            if you'd like read-only access.
        </p>
    </div>
}
