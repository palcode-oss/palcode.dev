import React, { ReactElement, useCallback, useState } from 'react';
import modal from '../styles/modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import form from '../styles/form.module.scss';
import Loader from 'react-loader-spinner';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Classroom, TaskStatus, TaskType, TemplateTask } from '../helpers/types';
import { useAuth } from '../helpers/auth';
import { useHistory } from 'react-router-dom';

interface Props {
    classroomId: string;
    closeModal: () => void;
}

export default function NewTaskModal(
    {
        classroomId,
        closeModal,
    }: Props,
): ReactElement {
    const [title, setTitle] = useState('');
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [user] = useAuth();
    const history = useHistory();
    const createTask = useCallback(() => {
        if (title.length <= 3) {
            enqueueSnackbar('Enter a title at least 4 characters in length.', {
                variant: 'warning',
            });
            return;
        }

        if (!user) return;

        setLoading(true);
        const doc = firebase
            .firestore()
            .collection('tasks')
            .doc();

        doc
            .set({
                createdBy: user.uid,
                name: title,
                status: TaskStatus.Unsubmitted,
                type: TaskType.Template,
                id: doc.id,
                created: new firebase.firestore.Timestamp(new Date().valueOf() / 1000, 0),
            } as TemplateTask)
            .then(() => {
                firebase
                    .firestore()
                    .collection('classrooms')
                    .doc(classroomId)
                    .get()
                    .then((snapshot) => {
                        firebase
                            .firestore()
                            .collection('classrooms')
                            .doc(classroomId)
                            .update({
                                tasks: (snapshot.data() as Classroom).tasks.concat(doc.id),
                            } as Partial<Classroom>)
                            .then(() => {
                                enqueueSnackbar('Task created successfully!', {
                                    variant: 'success',
                                });
                                setLoading(false);
                                history.push(`/task/${doc.id}`);
                            });
                    });
            });
    }, [classroomId, title, user]);

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        New task
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
                            htmlFor='title-input'
                        >
                            Task title
                        </label>
                        <input
                            type='text'
                            id='title-input'
                            onChange={handleTitleChange}
                            value={title}
                            disabled={loading}
                            className={form.textInput}
                        />

                        <p>
                            You'll be able to set instructions in the Markdown editor after creating the task.
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
                                    ) : 'Create task'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
