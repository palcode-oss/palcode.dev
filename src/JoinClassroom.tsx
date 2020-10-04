import React, { ReactElement, useCallback, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuth } from './helpers/auth';
import { Classroom, ClassroomDoc } from './helpers/types';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import form from './styles/form.module.scss';

export default function JoinClassroom(): ReactElement {
    const [user] = useAuth();

    const [code, setCode] = useState('');
    const {enqueueSnackbar} = useSnackbar();
    const handleChange = useCallback((e) => {
        if (
            Number.isInteger(parseInt(e.target.value))
            || e.target.value === ''
        ) {
            setCode(e.target.value);
        } else {
            enqueueSnackbar(
                'Please enter a 6-digit numerical classroom code.',
                {
                    variant: 'warning',
                    preventDuplicate: true,
                    autoHideDuration: 400,
                }
            );
        }
    }, [code]);

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const joinClassroom = useCallback(() => {
        if (!user) return;

        setLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('code', '==', code)
            .get()
            .then((data) => {
                if (!data.docs.length) {
                    setLoading(false);
                    setCode('');
                    enqueueSnackbar('That code was not found. Check that you\'ve entered it correctly and try again.', {
                        variant: 'error'
                    });

                    return;
                }

                const classroomData = {
                    ...data.docs[0].data() as ClassroomDoc,
                    id: data.docs[0].id
                } as Classroom;
                if (classroomData.members.includes(user.uid)) {
                    enqueueSnackbar('Looks like you\'re already a member of this classroom.', {
                        variant: 'info'
                    });
                    setLoading(false);
                    history.push(`/classroom/${classroomData.id}/view`);
                    return;
                }

                firebase
                    .firestore()
                    .collection('classrooms')
                    .doc(data.docs[0].id)
                    .update({
                        members: classroomData.members.concat(user.uid)
                    } as Partial<Classroom>)
                    .then(() => {
                        setLoading(false);
                        enqueueSnackbar(`Joined classroom '${classroomData.name}' successfully.`, {
                            variant: 'success'
                        });
                        history.push(`/classroom/${classroomData.id}/view`);
                    })
                    .catch(() => {
                        setLoading(false);
                        enqueueSnackbar(`Something went wrong joining classroom '${classroomData.name}'. Try again in a bit.`, {
                            variant: 'error'
                        });
                    });
            })
    }, [code, user]);

    return (
        <div className={form.joinClassroom}>
            <h1>
                Join a classroom
            </h1>
            <p>
                Enter the code displayed on your teacher's screen in the box below to join the new classroom.
            </p>

            <form
                className={form.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    joinClassroom()
                }}
            >
                <input
                    type='text'
                    className={form.textInput}
                    placeholder='Enter your classroom code...'
                    autoComplete='off'
                    maxLength={6}
                    minLength={6}

                    value={code}
                    disabled={loading}

                    onChange={handleChange}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />

                <button
                    disabled={!user || loading}
                    className={form.button}
                >
                    {
                        loading ? (
                            <Loader
                                type='Oval'
                                width={14}
                                height={14}
                                color='white'
                            />
                        ) : 'Join'
                    }
                </button>
            </form>
        </div>
    );
}
