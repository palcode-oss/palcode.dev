import React, { ReactElement, useCallback, useState } from 'react';
import { useAuth } from '../helpers/auth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { Shimmer } from 'react-shimmer';
import firebase from 'firebase';
import 'firebase/auth';
import { useSnackbar } from 'notistack';
import SignInModal from './SignInModal';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';

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
        <div className='navbar'>
            <h1 className='title'>
                <Link to='/'>
                    PalCode
                </Link>
            </h1>

            <div className='nav-options'>
                {
                    authUser && (
                        <>
                            <Link
                                className='option'
                                to='/'
                            >
                                <FontAwesomeIcon icon={faHome}/>
                                &nbsp;Dashboard
                            </Link>
                            <button
                                className='option sign-out'
                                onClick={signOut}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                                &nbsp;Sign out
                            </button>
                        </>
                    )
                }

                {
                    !authLoading && !authUser && (
                        <>
                            <button
                                className='option'
                                onClick={signIn}
                            >
                                <FontAwesomeIcon icon={faSignInAlt}/>
                                &nbsp;Sign in
                            </button>

                            <button
                                className='option'
                                onClick={signUp}
                            >
                                <FontAwesomeIcon icon={faUserPlus}/>
                                &nbsp;Sign up
                            </button>
                        </>
                    )
                }

                {
                    authLoading && (
                        <button className='option loading'>
                            <Shimmer
                                height={12}
                                width={100}
                                className='shimmer'
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
        </div>
    );
}
