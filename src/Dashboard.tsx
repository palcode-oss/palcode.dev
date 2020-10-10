import React, { ReactElement, useEffect, useState } from 'react';
import { useAuth } from './helpers/auth';
import Loader from 'react-loader-spinner';
import { Perms } from './helpers/types';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import LogInForm from './ui/LogInForm';
import form from './styles/form.module.scss';
import loader from './styles/loader.module.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import loginRedirect from './styles/login-redirect.module.scss';

export default function Dashboard(): ReactElement {
    const [, loading, userDoc] = useAuth();
    const [forceShowLogin, setForceShowLogin] = useState(false);
    const [redirectResult, setRedirectResult] = useState<firebase.auth.UserCredential | undefined>(undefined);

    useEffect(() => {
        firebase.auth().getRedirectResult()
            .then((data) => {
                if (data && data.user) {
                    setForceShowLogin(true);
                    setRedirectResult(data);
                }
            })
            .catch(() => {});
    }, []);

    if ((!loading && !userDoc) || forceShowLogin) {
        return (
            <div className={form.loginPrompt}>
                {!forceShowLogin && <>
                    <h1>
                        Welcome to PalCode! 👋
                    </h1>
                    <p>
                        To get started, click the button below to sign in with your MGS account. You won't need to provide any other details.
                    </p>
                </>}

                <LogInForm
                    redirectResult={redirectResult}
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

                <p className={loginRedirect.status}>
                    One moment...
                </p>
            </div>
        );
    }

    if (userDoc.perms !== Perms.Student) {
        return <TeacherDashboard user={userDoc}/>;
    }

    return <StudentDashboard user={userDoc}/>;
}
