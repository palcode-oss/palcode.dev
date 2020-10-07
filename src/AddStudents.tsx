import React, { ReactElement, useCallback, useState } from 'react';
import form from './styles/form.module.scss';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Params {
    classroomId: string;
}

export default function AddStudents(): ReactElement {
    const {classroomId} = useParams<Params>();
    const {replace} = useHistory();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const addStudents = useCallback(() => {
        if (loading) return;

        if (!classroomId) {
            enqueueSnackbar('No classroom ID found. Are you sure the URL is valid?', {
                variant: 'warning',
            });
            return;
        }

        const usernameArray = input
            .trim()
            .split('\n')
            .map(e => e.trim())
            .filter(e => e !== '' && e != null);

        if (usernameArray.length === 0) {
            enqueueSnackbar('No valid usernames found. Please check your input.', {
                variant: 'warning',
            });
            return;
        }

        setLoading(true);
        firebase.firestore()
            .collection('classrooms')
            .doc(classroomId)
            .update({
                members: firebase.firestore.FieldValue.arrayUnion(...usernameArray),
            })
            .then(() => {
                enqueueSnackbar('Students added!', {
                    variant: 'success',
                })

                setTimeout(() => {
                    replace(`/classroom/${classroomId}/manage`);
                }, 800);
            })
            .catch(() => {
                enqueueSnackbar('Something went wrong adding students. Please try again.', {
                    variant: 'error',
                });
                setLoading(false);
            });
    }, [input, classroomId, loading]);

    return (
        <div className={form.addStudents}>
            <h1>
                Add students
            </h1>

            <p>
                Please paste a list of student usernames (excluding <em>@mgs.org</em>) in the field below,&nbsp;
                <strong>one entry per line</strong>.
            </p>

            <form
                className={form.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    addStudents();
                }}
            >
                <label
                    className={form.label}
                    htmlFor='usernames'
                >
                    Student usernames
                </label>
                <textarea
                    className={form.textInput}
                    id='usernames'
                    onChange={e => setInput(e.target.value)}
                    value={input}
                    disabled={loading}
                />

                <button
                    className={form.button}
                    disabled={loading}
                >
                    Add
                </button>
            </form>
        </div>
    );
}
