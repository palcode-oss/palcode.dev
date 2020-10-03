import React, { ReactElement, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import * as EmailValidator from 'email-validator';
import firebase from 'firebase/app';
import { Perms, User } from '../helpers/types';
import Loader from 'react-loader-spinner';
import form from '../styles/form.module.scss';
import modal from '../styles/modal.module.scss';

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
        setPage
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
    const handleSignIn = useCallback(() => {
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
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
                enqueueSnackbar(`Welcome back, ${user.user?.displayName}! Signed in successfully.`, {
                    variant: 'success',
                });

                setLoading(false);
                callback();
            })
            .catch(() => {
                enqueueSnackbar('Something went wrong while signing you in. Please check your details and try again.', {
                    variant: 'error',
                });

                setLoading(false);
                setPassword('');
            });
    }, [email, password]);

    const handleSignUp = useCallback(() => {
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
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                const userObj = user.user;
                if (userObj) {
                    userObj
                        .updateProfile({
                            displayName,
                        })
                        .then(() => {
                            firebase
                                .auth()
                                .signInWithEmailAndPassword(email, password)
                                .then(() => {
                                    firebase
                                        .firestore()
                                        .collection('users')
                                        .doc(userObj.uid)
                                        .set({
                                            email,
                                            displayName,
                                            perms: Perms.Student,
                                            uid: userObj.uid,
                                        } as User)
                                        .then(() => {
                                            enqueueSnackbar('Success! You\'re now signed in with your new account.', {
                                                variant: 'success',
                                            });

                                            setLoading(false);
                                            callback();
                                        });
                                })
                                .catch(() => {
                                    enqueueSnackbar('Your new account was created successfully - log in to get started!', {
                                        variant: 'success',
                                    });

                                    setLoading(false);
                                    setPage(Page.SignIn);
                                    setPassword('');
                                });
                        })
                        .catch(() => {
                            enqueueSnackbar('Something went wrong while setting up your account. Try again later.', {
                                variant: 'error',
                            });

                            setLoading(false);
                            setPassword('');
                        });
                }
            })
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
            });
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
