import React, { ReactElement, useCallback, useState } from 'react';
import modal from '../styles/modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import form from '../styles/form.module.scss';
import Loader from 'react-loader-spinner';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Classroom, ClassroomDoc, TaskDoc, TaskStatus, TaskType, TemplateTask } from '../helpers/types';
import { useAuth } from '../helpers/auth';
import { useHistory } from 'react-router-dom';

interface Props {
    closeModal: () => void;
}

export default function NewClassroomModal(
    {
        closeModal,
    }: Props,
): ReactElement {
    const [name, setName] = useState('');
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [user] = useAuth();
    const history = useHistory();
    const createTask = useCallback(async () => {
        if (name.length <= 3) {
            enqueueSnackbar('Enter a classroom name at least 4 characters in length.', {
                variant: 'warning',
            });
            return;
        }

        if (!user) return;

        setLoading(true);
        const doc = firebase
            .firestore()
            .collection('classrooms')
            .doc();

        const getCode = () => Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        let code = getCode();
        let good = false;
        for (; !good;) {
            await firebase
                .firestore()
                .collection('classrooms')
                .where('code', '==', code)
                .get()
                .then((doc) => {
                    if (doc.empty) {
                        good = true;
                    } else {
                        code = getCode();
                    }
                });
        }

        doc
            .set({
                owner: user.uid,
                name,
                members: [],
                created: firebase.firestore.Timestamp.now(),
                tasks: [],
                code,
            } as ClassroomDoc)
            .then(() => {
                enqueueSnackbar('Classroom created successfully!', {
                    variant: 'success',
                });
                setLoading(false);
                history.push(`/classroom/${doc.id}/manage`);
            });
    }, [name, user]);

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        New classroom
                    </span>

                    <button
                        className={modal.close}
                        onClick={closeModal}
                    >
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                </div>

                <div className={modal.body}>
                    <form
                        className={form.form}
                        onSubmit={(e) => {
                            e.preventDefault();
                            createTask();
                        }}
                    >
                        <label
                            className={form.label}
                            htmlFor='name-input'
                        >
                            Classroom name
                        </label>
                        <input
                            type='text'
                            id='name-input'
                            onChange={handleTitleChange}
                            value={name}
                            disabled={loading}
                            className={form.textInput}
                        />

                        <p>
                            You'll be able to view the code and share it with your students later. Pupils will then
                            be able to self-admit to the classroom.
                        </p>

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
                                    ) : 'Create classroom'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
