import styles from '../styles/info.module.scss'
import React from 'react';

export default function Privacy() {
    return <div className={styles.textContainer}>
        <h1 className={styles.header}>
            Privacy
        </h1>

        <p>
            As a part of the MGS network, PalCode has been designed to collect as little data about you as necessary,
            and to store it as securely as possible.
        </p>
        <p>
            This page details how it works — it applies to both students and staff.
        </p>

        <h1 id='basis'>
            Relationship to MGS
        </h1>
        <p>
            PalCode's source code and branding belong solely to Pal Kerecsenyi, a student of the School. However,
            only MGS staff have access to student data stored by PalCode. All servers are maintained by The Manchester
            Grammar School, in conjunction with the sub-processors listed in this document.
        </p>
        <p>
            This document is intended as an informative extension to (not a replacement for)
            The Manchester Grammar School's&nbsp;
            <a
                href='https://bit.ly/3mdnm3k'
                target='_blank'
                rel='noreferrer'
            >
                Privacy Notice.
            </a>
        </p>
        <p>
            PalCode's legal basis for processing, as well as your rights under data protection law,
            are explained in the Privacy Notice.
        </p>

        <h1 id='data'>
            Data we process
        </h1>
        <p>
            While using this website, the following data may be collected and processed about you:
        </p>
        <ul>
            <li>
                Your name and username, from MGS' databases, operated by Microsoft Corporation.
            </li>
            <li>
                The classrooms you're a member of and, consequently, who your teacher(s) are
                (or vice-versa, the students you teach).
            </li>
            <li>
                Any code/text you upload or enter into the code editor.
            </li>
            <li>
                Any text or voice feedback you leave on students' work.
            </li>
            <li>
                Your public IP address, and metadata about your session. This includes, but is not limited to,
                your physical location, your browser's version/type, your session duration, and a UID that identifies you.
            </li>
        </ul>

        <h1 id='cookies'>
            Cookies, localStorage, and IndexedDB
        </h1>
        <p>
            PalCode may also store some cookies on your computer. All of these are essential — that is, the website
            cannot function without them.
        </p>
        <ul>
            <li>
                { /* note: this cookie is getting deprecated on 10/05/2021: https://blog.cloudflare.com/deprecating-cfduid-cookie/ */ }
                <code>__cfduid</code>
                &nbsp;— used by PalCode's firewall software, Cloudflare, to help detect malicious requests and prevent DDoS attacks.
            </li>
            <li>
                <code>io</code>
                &nbsp;— identifies your session uniquely so that real-time terminal interactions in the code editor can be seen
                by multiple people at once.
            </li>
        </ul>
        <p>
            As these cookies are essential, PalCode isn't required to give you an option to disable them. You may still disable
            them through your browser's settings, but by doing so, you understand that the website may no longer function as
            expected.
        </p>
        <p>
            On top of these cookies, PalCode also uses a similar technology known as localStorage. This stores your preferred
            code editor theme, as well as cached specifications for themes in JSON format (to avoid downloading them every time).
            These are also essential, and cannot be disabled. These pieces of data are never sent to any server, and remain
            restricted to your local browser at all times. This data persists on your browser indefinitely, unless you manually
            clear it.
        </p>
        <p>
            Finally, PalCode also uses IndexedDB, another technology similar to cookies. This is used to cache data from
            our databases, as well as store authentication-related data, all of which can be used to personally identify you.
            Similarly to localStorage, this data can persist indefinitely. Data may be sent to servers operated by Google
            (see <a href='#sub-processors'>sub-processors</a>) to determine whether you're authorised to read/write data,
            as well as to determine whether your authentication session is valid.
        </p>

        <h1 id='sub-processors'>
            Sub-processors
        </h1>
        <p>
            PalCode uses a number of services to host its website and data, known as sub-processors. These corporations
            generally don't have access to user data, but merely assist its processing.
        </p>
        <p>
            Each of these corporations may also have sub-processors.
        </p>
        <ul>
            <li>
                <strong>Google Ireland Limited and Google Commerce Limited</strong><br/>
                Gordon House, Barrow Street, Dublin 4, Ireland
            </li>
            <li>
                <strong>DigitalOcean LLC</strong><br/>
                101 6th Ave, New York, NY 10013, United States
            </li>
            <li>
                <strong>Cloudflare, Inc. and Cloudflare Limited</strong><br/>
                101 Townsend St, San Francisco, CA 94107, United States<br/>
                County Hall/The Riverside Building, 6th Floor, Belvedere Rd, London SE1 7PB, United Kingdom
            </li>
            <li>
                <strong>Microsoft Ireland Operations Limited</strong><br/>
                One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland
            </li>
        </ul>

        <h1>
            Your agreement
        </h1>
        <p>
            By using PalCode, you agree to all the terms set out in this policy, as well as in the MGS Privacy Notice.
        </p>
    </div>
}
