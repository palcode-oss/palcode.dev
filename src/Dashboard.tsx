import React, { ReactElement, useState } from 'react';
import { useAuth } from './helpers/auth';
import Loader from 'react-loader-spinner';
import { Perms } from './helpers/types';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import LogInForm, { Page } from './ui/LogInForm';
import form from './styles/form.module.scss';
import loader from './styles/loader.module.scss';

export default function Dashboard(): ReactElement {
    const [, loading, userDoc] = useAuth();
    const [page, setPage] = useState(Page.SignUp);

    if (!loading && !userDoc) {
        return (
            <div className={form.loginPrompt}>
                <h1>
                    Sign up to get started.
                </h1>
                <p>
                    You'll be able to join your classrooms after sign-up.
                </p>
                <LogInForm
                    callback={() => window.location.reload()}
                    page={page}
                    setPage={setPage}
                />
            </div>
        );
    }

    if (loading || !userDoc) {
        return (
            <div className={loader.loader}>
                <Loader
                    type='Oval'
                    width={120}
                    height={120}
                    color='blue'
                />
            </div>
        );
    }

    if (userDoc.perms === Perms.Student) {
        return <StudentDashboard user={userDoc}/>;
    }

    return <TeacherDashboard user={userDoc}/>;
}
