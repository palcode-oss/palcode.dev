import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-spinner';
import * as EmailValidator from 'email-validator';
import { useSnackbar } from 'notistack';
import firebase from 'firebase';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import 'firebase/auth';
import 'firebase/firestore';
import { Perms, User } from '../helpers/types';
import modal from '../styles/modal.module.scss';
import form from '../styles/form.module.scss';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

import LogInForm, { Page } from './LogInForm';

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

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        {
                            page === Page.SignIn ? 'Sign in' : 'Sign up'
                        }
                    </span>

                    <button
                        className={modal.close}
                        onClick={closeModal}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                </div>

                <div className={modal.body}>
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
                <div className='modal-body'>
                    <LogInForm
                        callback={closeModal}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
}
