import React, { ReactElement, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import * as EmailValidator from 'email-validator';
import firebase from 'firebase/app';
import { Perms, UserDoc } from '../helpers/types';
import Loader from 'react-loader-spinner';
import form from '../styles/form.module.scss';
import modal from '../styles/modal.module.scss';
import * as msal from '@azure/msal-browser';

const msalInstance = new msal.PublicClientApplication({
    auth: {
        clientId: 'e177588e-b1f9-472a-bbc3-a4bd093aadf7',
        authority: 'https://login.microsoftonline.com/common/',
    }
});

interface Props {
    callback: () => void;
    page: Page;
    setPage: (page: Page) => void;
}

export enum Page {
    SignUp,
    SignIn,
}

export default function LogInForm(
    {
        callback,
        page,
        setPage,
    }: Props,
): ReactElement {
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);
    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);
    const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
    }, []);

    const {enqueueSnackbar} = useSnackbar();
    const msalLogin = useCallback(() => {
        msalInstance.loginRedirect({
            scopes: ['user.read'],
            redirectUri: window.location.protocol + '//' + window.location.host + '/login'
        })
            .then(data => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const handleSignIn = useCallback(async () => {
        if (!EmailValidator.validate(email)) {
            enqueueSnackbar('Enter a valid email address.', {
                variant: 'warning',
            });

            return;
        }

        if (password.length === 0) {
            enqueueSnackbar('Enter your password, then try again.', {
                variant: 'warning',
            });

            return;
        }

        setLoading(true);
        const user = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(() => {
                enqueueSnackbar('Something went wrong while signing you in. Please check your details and try again.', {
                    variant: 'error',
                });

                setLoading(false);
                setPassword('');

                return null;
            });

        if (!user) return;

        enqueueSnackbar(`Welcome back, ${user.user?.displayName}! Signed in successfully.`, {
            variant: 'success',
        });

        setLoading(false);
        callback();
    }, [email, password]);

    const handleSignUp = useCallback(async () => {
        if (!EmailValidator.validate(email)) {
            enqueueSnackbar('Enter a valid email address.', {
                variant: 'error',
            });

            return;
        }

        if (password.length < 8) {
            enqueueSnackbar('Enter a password at least 8 characters in length.', {
                variant: 'error',
            });

            return;
        }

        setLoading(true);
        const user = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    enqueueSnackbar('That email address seems to already be in use. Try signing in instead.', {
                        variant: 'info',
                    });

                    setPage(Page.SignIn);
                } else {
                    enqueueSnackbar('Something went wrong while creating your account. Try again later.', {
                        variant: 'error',
                    });
                }

                setLoading(false);
                setPassword('');
                return null;
            });

        const userObj = user?.user;
        if (!userObj) return;

        await userObj
            .updateProfile({
                displayName,
            })
            .catch(() => {
                enqueueSnackbar('Something went wrong while setting up your account. Try again later.', {
                    variant: 'error',
                });

                setLoading(false);
                setPassword('');
            });

        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(() => {
                enqueueSnackbar('Your new account was created successfully - log in to get started!', {
                    variant: 'success',
                });

                setLoading(false);
                setPage(Page.SignIn);
                setPassword('');
            });

        await firebase
            .firestore()
            .collection('users')
            .doc(userObj.uid)
            .set({
                email,
                displayName,
                perms: Perms.Student,
            } as UserDoc);

        enqueueSnackbar('Success! You\'re now signed in with your new account.', {
            variant: 'success',
        });

        setLoading(false);
        callback();
    }, [email, password, displayName]);

    const changePage = useCallback(() => {
        if (page === Page.SignIn) {
            setPage(Page.SignUp);
            setDisplayName('');
        } else {
            setPage(Page.SignIn);
        }

        setPassword('');
    }, [page]);

    return (
        <>
            <button
                onClick={msalLogin}
            >
                Sign in
            </button>

            <form
                className={form.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    page === Page.SignIn ? handleSignIn() : handleSignUp();
                }}
            >
                {
                    page === Page.SignUp && <>
                        <label
                            className={form.label}
                            htmlFor='display-name-input'
                        >
                            Full name
                        </label>
                        <input
                            type='text'
                            id='display-name-input'
                            onChange={handleDisplayNameChange}
                            value={displayName}
                            disabled={loading}
                            className={form.textInput}
                        />
                    </>
                }

                <label
                    className={form.label}
                    htmlFor='email-input'
                >
                    Email address
                </label>

                <input
                    type='email'
                    id='email-input'
                    onChange={handleEmailChange}
                    value={email}
                    disabled={loading}
                    className={form.textInput}
                />

                <label
                    className={form.label}
                    htmlFor='password-input'
                >
                    Password
                </label>

                <input
                    type='password'
                    id='password-input'
                    onChange={handlePasswordChange}
                    value={password}
                    disabled={loading}
                    className={form.textInput}
                />

                {
                    page === Page.SignUp && (
                        <p>
                            Your data will be handled in accordance with The Manchester Grammar School's privacy
                            policies.
                        </p>
                    )
                }

                <button
                    type='submit'
                    disabled={loading}
                    className={form.button}
                >
                    {
                        loading
                            ? (
                                <Loader
                                    type='Oval'
                                    width={14}
                                    height={14}
                                    color='white'
                                />
                            ) : ['Sign up', 'Sign in'][page]
                    }
                </button>
            </form>

            <button
                className={modal.toggleLink}
                onClick={changePage}
                disabled={loading}
            >
                {
                    page === Page.SignIn
                        ? 'Need an account? Sign up here.'
                        : 'Already have an account? Sign in instead.'
                }
            </button>
        </>
    );
}
