import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import modal from '../styles/modal.module.scss';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

import LogInForm from './LogInForm';

interface Props {
    closeModal: () => void;
}

export default function SignInModal(
    {
        closeModal,
    }: Props,
): ReactElement {
    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        Sign in
                    </span>

                    <button
                        className={modal.close}
                        onClick={closeModal}
                    >
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                </div>

                <div className={modal.body}>
                    <LogInForm />
                </div>
            </div>
        </div>
    );
}
