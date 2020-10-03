import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import modal from '../styles/modal.module.scss';
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
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                </div>

                <div className={modal.body}>
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
