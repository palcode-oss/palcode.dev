import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/auth';
import form from '../styles/form.module.scss';
import styles from '../styles/login.module.scss';
import Loader from 'react-loader-spinner';
import { Perms, UserDoc } from '../types';
import { Link } from 'react-router-dom';
import { getSchoolAuth } from '../helpers/school';
import axios from 'axios';
import getEnvVariable from '../helpers/getEnv';

export default function LogInForm(
    {
        redirectResult,
        onRedirectAuthorised,
    }: {
        redirectResult?: firebase.auth.UserCredential,
        onRedirectAuthorised(): void,
    }
): ReactElement {
    const {enqueueSnackbar} = useSnackbar();
    const [signingIn, setSigningIn] = useState(true);
    const [schoolDomain, setSchoolDomain] = useState('');

    const login = useCallback(async () => {
        enqueueSnackbar('Signing in...', {
            variant: 'info',
            preventDuplicate: true,
            persist: true,
        });

        const schoolAuth = await getSchoolAuth(schoolDomain);
        if (!schoolAuth) {
            enqueueSnackbar(
                'Oops... it looks like we\'ve never heard of that domain before.',
                {
                    variant: 'error',
                    preventDuplicate: true,
                }
            );
            return;
        }

        const provider = new firebase.auth.OAuthProvider(schoolAuth.service);
        let tenantParameterName = 'tenant';
        switch (schoolAuth.service) {
            case 'microsoft.com':
                tenantParameterName = 'tenant';
                break;
            case 'google.com':
                tenantParameterName = 'hd';
                break;
        }
        provider.setCustomParameters({
            [tenantParameterName]: schoolAuth.tenant,
        });

        return firebase.auth()
            .signInWithRedirect(provider)
            .catch(() => {
                enqueueSnackbar('We couldn\'t sign you in. Please ensure popups are enabled, and try again.', {
                    variant: 'warning',
                    preventDuplicate: true,
                });

                return null;
            });
    }, [schoolDomain]);

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

            const token = await redirectResult.user.getIdToken(true);
            if (!token) {
                setSigningIn(false);
                enqueueSnackbar('We couldn\'t sign you in. Please try again.', {
                    variant: 'warning',
                });
                return;
            }

            try {
                await axios.post(
                    getEnvVariable('API') + '/ensure-user',
                    {
                        token,
                    }
                );
            } catch (e) {
                setSigningIn(false);
                enqueueSnackbar('Something went wrong. Please speak to your administrator.', {
                    variant: 'error',
                });
                return;
            }

            enqueueSnackbar(`Hi there! Signed in successfully.`, {
                variant: 'success',
            });

            onRedirectAuthorised();
            setSigningIn(false);
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
                    Enter your domain to get started. Signing you in for the first time may take a few seconds.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        return login();
                    }}
                    className={form.form}
                >
                    <label
                        className={form.label}
                        htmlFor='domain'
                    >
                        Your school's domain
                    </label>
                    <input
                        className={form.textInput}
                        id='domain'
                        value={schoolDomain}
                        onChange={(e) => setSchoolDomain(e.target.value)}
                        placeholder='E.g. myschool.edu'
                        required
                    />

                    <button
                        className={form.button}
                    >
                        Sign in!
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
                        Ask your teacher
                    </li>
                    <li>
                        Take a look at documentation for your language
                    </li>
                    <li>
                        Ask a question on&nbsp;
                        <a
                            href='https://stackoverflow.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Stack Overflow
                        </a>
                    </li>
                </ul>

                <p>
                    Got feature suggestions, bugs, or general feedback? Please send an email to contact@palcode.dev.
                </p>
            </div>

            <div className={styles.authPageElement}>
                <p>
                    By using PalCode, your agreement to our use of essential cookies is assumed. More details can be found
                    in the&nbsp;
                    <Link
                        to='/privacy'
                    >
                        Privacy Policy.
                    </Link>
                </p>
                <p>
                    PalCode is an open-source project, distributed under the MIT license. Copyright © PalChat Technologies Limited 2020.
                </p>
            </div>
        </div>
    );
}
