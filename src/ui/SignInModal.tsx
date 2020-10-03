import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import 'firebase/auth';
import 'firebase/firestore';
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
