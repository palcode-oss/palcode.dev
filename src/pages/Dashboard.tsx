import React, { lazy, ReactElement, Suspense, useEffect, useState } from 'react';
import { useAuth } from '../helpers/auth';
import Loader from 'react-loader-spinner';
import { Perms } from '../types';
import loader from '../styles/loader.module.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import loginRedirect from '../styles/login.module.scss';
import LazyComponentFallback from '../ui/LazyComponentFallback';

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
            .catch((e) => console.warn(e));
    }, []);

    if ((!loading && !userDoc) || forceShowLogin) {
        const LogInForm = lazy(() => import('../components/LogInForm'));
        return (
            <Suspense fallback={<LazyComponentFallback />}>
                <LogInForm
                    redirectResult={redirectResult}
                    onRedirectAuthorised={() => {
                        setForceShowLogin(false);
                        setRedirectResult(undefined);
                    }}
                />
            </Suspense>
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
        const TeacherDashboard = lazy(() => import('./TeacherDashboard'));
        return <Suspense fallback={<LazyComponentFallback />}>
            <TeacherDashboard />
        </Suspense>
    }

    const StudentDashboard = lazy(() => import('./StudentDashboard'));
    return <Suspense fallback={<LazyComponentFallback />}>
        <StudentDashboard user={userDoc}/>
    </Suspense>;
}
