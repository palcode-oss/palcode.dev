import React, { ReactElement, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import Loader from 'react-loader-spinner';
import * as EmailValidator from 'email-validator';
import { useSnackbar } from 'notistack';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { Perms, User } from '../helpers/types';

enum Page {
    SignUp,
    SignIn,
}

interface Props {
    forceSignUp?: boolean;
    closeModal: () => void;
}

export default function SignInModal(
    {
        forceSignUp,
        closeModal,
    }: Props,
): ReactElement {
    const [page, setPage] = useState(forceSignUp ? Page.SignUp : Page.SignIn);
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
                closeModal();
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
                                        } as User)
                                        .then(() => {
                                            enqueueSnackbar('Success! You\'re now signed in with your new account.', {
                                                variant: 'success',
                                            });

                                            setLoading(false);
                                            closeModal();
                                        });
                                })
                                .catch(() => {
                                    enqueueSnackbar('Your new account was created successfully - log in to get started!', {
                                        variant: 'success',
                                    });

                                    setLoading(false);
                                    setPage(Page.SignIn);
                                    setPassword('');
                                })
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
        <div className='modal'>
            <div className='modal-contents'>
                <div className='modal-head'>
                    {
                        page === Page.SignIn ? 'Sign in' : 'Sign up'
                    }

                    <button
                        className='modal-close'
                        onClick={closeModal}
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                <div className='modal-body'>
                    <form>
                        {
                            page === Page.SignUp && (
                                <label htmlFor='display-name-input'>
                                    Full name
                                    <input
                                        type='text'
                                        id='display-name-input'
                                        onChange={handleDisplayNameChange}
                                        value={displayName}
                                        disabled={loading}
                                    />
                                </label>
                            )
                        }

                        <label htmlFor='email-input'>
                            Email address
                            <input
                                type='text'
                                id='email-input'
                                onChange={handleEmailChange}
                                value={email}
                                disabled={loading}
                            />
                        </label>

                        <label htmlFor='password-input'>
                            Password
                            <input
                                type='password'
                                id='password-input'
                                onChange={handlePasswordChange}
                                value={password}
                                disabled={loading}
                            />
                        </label>

                        <button
                            type='button'
                            onClick={page === Page.SignIn ? handleSignIn : handleSignUp}
                            disabled={loading}
                        >
                            {
                                loading
                                    ? (
                                        <Loader
                                            type='Oval'
                                            width={14}
                                            height={14}
                                            color='blue'
                                        />
                                    ) : ['Sign up', 'Sign in'][page]
                            }
                        </button>
                    </form>

                    <button
                        className='sign-in-up-toggle'
                        onClick={changePage}
                        disabled={loading}
                    >
                        {
                            page === Page.SignIn
                                ? 'Need an account? Sign up here.'
                                : 'Already have an account? Sign in instead.'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
