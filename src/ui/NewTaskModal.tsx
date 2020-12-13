import React, { ReactElement, useCallback, useState } from 'react';
import modal from '../styles/modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import form from '../styles/form.module.scss';
import Loader from 'react-loader-spinner';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { TaskLanguage, TaskStatus, TaskType } from '../types';
import { useAuth } from '../helpers/auth';
import { useHistory } from 'react-router-dom';

interface Props {
    closeModal: () => void;
}

interface ClassroomProps extends Props {
    classroomId: string;
    privateTask: false;
}

interface PrivateProps extends Props {
    privateTask: true;
}

export default function NewTaskModal(
    props: PrivateProps | ClassroomProps,
): ReactElement {
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState<TaskLanguage>('python');

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

        const type = props.privateTask ? TaskType.Private : TaskType.Template;
        const documentData = {
            createdBy: user.uid,
            name: title,
            language,
            type,
            created: firebase.firestore.Timestamp.now(),
        } as any;

        if (!props.privateTask)  {
            documentData.status = TaskStatus.Unsubmitted;
            documentData.classroomId = props.classroomId;
        }

        doc
            .set(documentData)
            .then(() => {
                enqueueSnackbar('Task created successfully!', {
                    variant: 'success',
                });
                setLoading(false);
                history.push(`/task/${doc.id}`);
            });
    }, [props, title, user, language]);

    const objectName = props.privateTask ? 'Project' : 'Task';

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                    <span className={modal.title}>
                        New {objectName.toLowerCase()}
                    </span>

                    <button
                        className={modal.close}
                        onClick={props.closeModal}
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
                            {objectName} title
                        </label>
                        <input
                            type='text'
                            id='title-input'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            disabled={loading}
                            className={form.textInput}
                        />

                        <label
                            className={form.label}
                            htmlFor='language-input'
                        >
                            Language
                        </label>
                        <select
                            id='language-input'
                            onChange={(e) => setLanguage(e.target.value as TaskLanguage)}
                            value={language}
                            disabled={loading}
                            className={form.select}
                        >
                            <option value='python'>Python</option>
                            <option value='nodejs'>NodeJS</option>
                        </select>

                        {!props.privateTask && (
                            <p>
                                You'll be able to set instructions in the Markdown editor after creating the task.
                            </p>
                        )}

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
                                    ) : 'Create ' + objectName.toLowerCase()
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
