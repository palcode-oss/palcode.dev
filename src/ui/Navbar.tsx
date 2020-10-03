import React, { ReactElement, useCallback, useState } from 'react';
import { useAuth } from '../helpers/auth';
import { Link } from 'react-router-dom';
import { Shimmer } from 'react-shimmer';
import firebase from 'firebase';
import 'firebase/auth';
import { useSnackbar } from 'notistack';
import SignInModal from './SignInModal';
import styles from '../styles/navbar.module.scss';

export default function Navbar(): ReactElement {
    const [authUser, authLoading] = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const signOut = useCallback(() => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                enqueueSnackbar('You\'re now signed out.', {
                    variant: 'info',
                });
            });
    }, []);

    const [showSignInModal, setShowSignInModal] = useState(false);
    const signIn = useCallback(() => {
        setShowSignInModal(true);
        setShowSignUpModal(false);
    }, []);

    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const signUp = useCallback(() => {
        setShowSignUpModal(true);
        setShowSignInModal(false);
    }, []);

    return (
        <nav className={styles.navbar}>
            <h1 className={styles.title}>
                <Link to='/'>
                    PalCode
                </Link>
            </h1>

            <div className={styles.options}>
                {
                    authUser && (
                        <>
                            <Link
                                className={styles.option}
                                to='/'
                            >
                                Dashboard
                            </Link>
                            <button
                                className={styles.option}
                                onClick={signOut}
                            >
                                Sign out
                            </button>
                        </>
                    )
                }

                {
                    !authLoading && !authUser && (
                        <>
                            <button
                                className={styles.option}
                                onClick={signIn}
                            >
                                Sign in
                            </button>

                            <button
                                className={styles.option}
                                onClick={signUp}
                            >
                                Sign up
                            </button>
                        </>
                    )
                }

                {
                    authLoading && (
                        <button className='option loading'>
                            <Shimmer
                                height={16}
                                width={100}
                                className={styles.shimmer}
                            />
                        </button>
                    )
                }
            </div>

            {
                showSignInModal && (
                    <SignInModal
                        closeModal={() => setShowSignInModal(false)}
                    />
                )
            }

            {
                showSignUpModal && (
                    <SignInModal
                        forceSignUp
                        closeModal={() => setShowSignUpModal(false)}
                    />
                )
            }
        </nav>
    );
}
