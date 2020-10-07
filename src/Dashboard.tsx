import React, { ReactElement } from 'react';
import { useAuth } from './helpers/auth';
import Loader from 'react-loader-spinner';
import { Perms } from './helpers/types';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import LogInForm from './ui/LogInForm';
import form from './styles/form.module.scss';
import loader from './styles/loader.module.scss';

export default function Dashboard(): ReactElement {
    const [, loading, userDoc] = useAuth();

    if (!loading && !userDoc) {
        return (
            <div className={form.loginPrompt}>
                <h1>
                    Welcome to PalCode! 👋
                </h1>
                <p>
                    To get started, click the button below to sign in with your MGS account. You won't need to provide any other details.
                </p>
                <LogInForm
                    callback={() => window.location.reload()}
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

    if (userDoc.perms !== Perms.Student) {
        return <TeacherDashboard user={userDoc}/>;
    }

    return <StudentDashboard user={userDoc}/>;
}
