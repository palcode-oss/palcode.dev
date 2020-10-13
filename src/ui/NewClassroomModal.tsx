import React, { ReactElement, useCallback, useState } from 'react';
import modal from '../styles/modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import form from '../styles/form.module.scss';
import Loader from 'react-loader-spinner';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { ClassroomDoc } from '../helpers/types';
import { useAuth } from '../helpers/auth';
import { useHistory } from 'react-router-dom';

export enum NewClassroomAction {
    New,
    Clone,
}

interface Props {
    closeModal: () => void;
    modalAction: NewClassroomAction;
}

interface NewProps extends Props {
    modalAction: NewClassroomAction.New;
}

interface CloneProps extends Props {
    classroomId: string;
    modalAction: NewClassroomAction.Clone;
}

export default function NewClassroomModal(props: NewProps | CloneProps): ReactElement {
    const {modalAction, closeModal} = props;

    const [name, setName] = useState('');
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [user] = useAuth();
    const history = useHistory();

    const validateClassroom = useCallback(() => {
        if (name.length <= 3) {
            enqueueSnackbar('Enter a classroom name at least 4 characters in length.', {
                variant: 'warning',
            });
            return false;
        } else {
            return true;
        }
    }, [name]);

    const createClassroom = useCallback(async () => {
        if(!validateClassroom()) return;
        if (!user) return;

        setLoading(true);
        const classroomDoc = firebase
            .firestore()
            .collection('classrooms')
            .doc();

        classroomDoc
            .set({
                owner: user.uid,
                name,
                members: [],
                created: firebase.firestore.Timestamp.now(),
                tasks: [],
            } as ClassroomDoc)
            .then(() => {
                enqueueSnackbar('Classroom created successfully!', {
                    variant: 'success',
                });
                setLoading(false);
                history.push(`/classroom/${classroomDoc.id}/manage`);
            });
    }, [name, user]);

    const cloneClassroom = useCallback(async () => {
        if(!validateClassroom()) return;
        if (!('classroomId' in props)) return;

        setLoading(true);

        const token = await firebase.auth().currentUser?.getIdToken(true);

        if (!token) {
            setLoading(false);
            return;
        }

        const {default: axios} = await import('axios');
        axios.post(process.env.REACT_APP_API + '/clone-classroom', {
            classroomId: props.classroomId,
            classroomName: name,
            token,
        })
            .then(response => {
                setLoading(false);
                history.push(`/classroom/${response.data}/manage`);
            })
            .catch(() => {
                setLoading(false);
                enqueueSnackbar('Something went wrong. Please try again later.', {
                    variant: 'error',
                    preventDuplicate: true,
                });
            });
    }, [props, name]);

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        {modalAction === NewClassroomAction.New ? 'New' : 'Clone'} classroom
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
                            if (modalAction === NewClassroomAction.New) {
                                createClassroom();
                            } else if (modalAction === NewClassroomAction.Clone) {
                                cloneClassroom();
                            }
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
                            You'll be able to paste a list of usernames once the classroom has been created.
                        </p>

                        {modalAction === NewClassroomAction.Clone && <p>
                            Task submissions and class members won't be cloned.
                        </p>}

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
