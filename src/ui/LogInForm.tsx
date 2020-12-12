import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/auth';
import form from '../styles/form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/login-redirect.module.scss';
import Loader from 'react-loader-spinner';
import { Perms, UserDoc } from '../helpers/types';
import { Link } from 'react-router-dom';

const provider = new firebase.auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({
    // https://www.whatismytenantid.com/
    // see https://firebase.google.com/docs/auth/web/microsoft-oauth for details on how to use
    tenant: process.env.REACT_APP_TENANT,
});

interface MicrosoftProfile {
    givenName?: string;
    surname?: string;
}

export default function LogInForm(
    {
        redirectResult,
    }: {
        redirectResult?: firebase.auth.UserCredential,
    }
): ReactElement {
    const {enqueueSnackbar} = useSnackbar();
    const [signingIn, setSigningIn] = useState(true);
    const msalLogin = useCallback(() => {
        return firebase.auth()
            .signInWithRedirect(provider)
            .catch(() => {
                enqueueSnackbar('We couldn\'t sign you in. Please ensure popups are enabled, and try again.', {
                    variant: 'warning',
                    preventDuplicate: true,
                });

                return null;
            });
    }, []);

    useEffect(() => {
        if (!signingIn) {
            document.body.classList.add('login-form');
            return () => document.body.classList.remove('login-form');
        }
    }, [signingIn]);

    useEffect(() => {
        (async () => {
            if (!redirectResult || !redirectResult.user) {
                setSigningIn(false);
                return;
            } else {
                setSigningIn(true);
            }

            if (!redirectResult.user.email?.endsWith('mgs.org')) {
                enqueueSnackbar('Sorry, PalCode is only available for users with @mgs.org email addresses.', {
                    variant: 'error',
                });
                setSigningIn(false);
                return;
            }

            const existingUserResponse = await firebase.firestore()
                .collection('users')
                .doc(redirectResult.user.uid)
                .get();

            // for students, displayName is always their MGS username. not a nice, real name.
            // we default to displayName, but the additionalUserInfo object almost always contains the user's actual name
            let displayName = redirectResult.user.displayName;
            let givenName = redirectResult.user.displayName;
            if (redirectResult.additionalUserInfo?.profile) {
                const profile = redirectResult.additionalUserInfo.profile as MicrosoftProfile;
                if (profile.givenName && profile.surname) {
                    displayName = profile.givenName + ' ' + profile.surname;
                    givenName = profile.givenName;
                }
            }

            if (!existingUserResponse.exists) {
                await firebase.firestore()
                    .collection('users')
                    .doc(redirectResult.user.uid)
                    .set({
                        email: redirectResult.user.email,
                        displayName,
                        username: redirectResult.user.email?.split('@mgs.org')[0],
                        perms: Perms.Student,
                    } as UserDoc);
            }

            enqueueSnackbar(`Hi ${givenName}! Signed in successfully. Please wait a moment...`, {
                variant: 'success',
            });

            setTimeout(() => {
                window.location.reload();
            }, 500);
        })();
    }, [redirectResult]);

    if (signingIn) {
        return (
            <div className={styles.container}>
                <Loader
                    type='Oval'
                    width={120}
                    height={120}
                    color='blue'
                />

                <p
                    className={styles.status}
                >
                    Logging you in...
                </p>
            </div>
        );
    }

    return (
        <div className={styles.authPageContainer}>
            <div className={styles.authPageElement}>
                <h1>
                    Welcome to PalCode! 👋
                </h1>
                <p>
                    Signing you in for the first time may take a few seconds.
                </p>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className={form.form}
                >
                    <button
                        onClick={msalLogin}
                        className={form.button}
                    >
                        <FontAwesomeIcon icon={faMicrosoft} />
                        Sign in with MGS
                    </button>
                </form>
            </div>

            <div className={styles.authPageElement}>
                <h1>
                    Help
                </h1>
                <p>
                    If you need any help using PalCode, here are some things you can do:
                </p>

                <ul>
                    <li>
                        Visit <Link to='/help'>PalCode's help page</Link>.
                    </li>
                    <li>
                        Ask your Computing teacher
                    </li>
                    <li>
                        Take a look at&nbsp;
                        <a
                            href='https://docs.python.org/3/'
                            target='_blank'
                            rel='noreferrer'
                        >
                            Python's docs.
                        </a>
                    </li>
                </ul>

                <p>
                    Got feature suggestions, bugs, or general feedback? Please send an email to kerecsenyip-y15@mgs.org.
                </p>
            </div>

            <div className={styles.authPageElement}>
                <p>
                    PalCode stores some essential cookies on your browser, which you can't turn off. Other than that,
                    this website operates under The Manchester Grammar School's&nbsp;
                    <a
                        href='https://bit.ly/3mdnm3k'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Privacy Notice.
                    </a>
                </p>
                <p>
                    PalCode is a closed-source project, distributed under the MIT license.
                </p>
            </div>
        </div>
    );
}
