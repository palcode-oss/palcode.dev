import styles from '../styles/info.module.scss'
import React, { useMemo } from 'react';

export default function Privacy() {
    const isCloudHosted = useMemo(() => {
        return ['palcode.dev', 'app.palcode.dev'].includes(window.location.host);
    }, [window.location.host]);

    return <div className={styles.textContainer}>
        <h1 className={styles.header}>
            Privacy Policy
        </h1>

        {!isCloudHosted && (
            <p>
                <strong>
                    Warning: because you're using a locally-hosted version of PalCode, this policy does not apply to you.
                    &nbsp;<a href='#agreement'>Click here</a> for more info.
                </strong>
            </p>
        )}

        <p>
            Last updated: 26/12/2020
        </p>

        <h1 id='introduction'>
            Introduction
        </h1>
        <p>
            PalCode ("the Platform", "PalCode", "the Website") is open-source software, maintained by PalChat Technologies Limited
            ("the Company", or any pronoun: "we", "us", "our", etc.), a company registered in England
            and Wales (number 12615227).
        </p>

        <p>
            The Company operates under the UK Data Protection Act 2018 ("the DPA"), and we're committed to taking your privacy very
            seriously. This policy outlines how we do that, what your rights are, and how you can exercise them.
        </p>

        <h1 id='data'>
            Data we process
        </h1>
        <p>
            While using this Website, the following data may be collected and processed about you:
        </p>
        <ul>
            <li>
                Your name and username, from your school's databases (operated by a third-party).
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
                your physical location, your browser's version/type and your session duration.
                This data is always anonymous, so it can never be connected with your personally.
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
                <code>GCLB</code>
                &nbsp;— identifies which PalCode server you're connected to so you stay connected to the same one for an
                extended period of time.
            </li>
        </ul>
        <p>
            As these cookies are essential, PalCode isn't required to give you an option to disable them. You may still disable
            them through your browser's settings, but by doing so, you understand that the website may no longer function as
            expected. These cookies are not and cannot be shared with websites outside the palcode.dev namespace.
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

        <h1 id='rights'>
            Your rights
        </h1>
        <p>
            Under the DPA, you can issue subject access requests. We are legally required to respond to these within
            28 days, and we cannot charge unreasonable fees for them. Typically, we'll action such requests within a few
            business days.
        </p>
        <p>
            The article numbers in the following sections refer to the DPA, not the EU General Data Protection Regulation 2018,
            which no longer applies directly in the UK.
        </p>
        <h2>
            Right of access (article 45)
        </h2>
        <p>
            You can always access data we store about you. Some of your data may be available through our website.
            To get a full report of your data, email sar@palcode.dev. In some cases, we may be unable to provide
            some of your data — see 45(4) of the DPA for more information. We'll let you know if any of these apply.
        </p>
        <h2>
            Right to rectification (article 46)
        </h2>
        <p>
            To request a rectification of your personal data, please contact sar@palcode.dev. We'll respond within 28 days
            and we'll never charge you a fee. If we need to maintain your data for evidence, we may be unable to action
            this request.
        </p>
        <h2>
            Right to erasure or restriction of processing (article 47)
        </h2>
        <p>
            You cannot request us to restrict the processing of your data, as all data collected about you is essential for
            providing our services.
        </p>
        <p>
            You can only request erasure of your data if:
        </p>
        <ul>
            <li>You believe we are processing your data unnecessarily; or</li>
            <li>Your school administrator has given you permission to delete your account.</li>
        </ul>
        <p>
            In either of these cases, please email sar@palcode.dev.
        </p>

        <h1 id='agreement'>
            Your agreement
        </h1>
        <p>
            When using PalCode's cloud-hosted service, all users of the Platform agree to this policy. This policy does not
            apply to locally-hosted instances of PalCode.
        </p>
        <h3>
            Am I using cloud-hosted or locally-hosted PalCode?
        </h3>
        <p>
            Based on metadata from your browser, you're using {isCloudHosted ? 'cloud-hosted' : 'locally-hosted'} PalCode.
            If this page's domain ends in palcode.dev, you're on the official cloud-hosted version of PalCode. If your school
            hosts PalCode locally, you'll see a different domain.
        </p>

        <h1 id='changes'>
            Changes to this policy
        </h1>
        <p>
            When making a change to this policy, we'll send an email to all users of our cloud-hosted platform, including
            students. The email will contain a side-by-side diff and will be sent at least 7 days before the planned modification
            date.
        </p>
    </div>
}
