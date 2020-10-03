import React, { ReactElement } from 'react';
import { useAuth } from './helpers/auth';
import Loader from 'react-loader-spinner';
import { Perms } from './helpers/types';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

export default function Dashboard(): ReactElement {
    const [authUser, loading, userDoc] = useAuth();

    if (!loading && !authUser) {
        return (
            <>
                <p>
                    Please sign in.
                </p>
            </>
        )
    }

    if (loading || !userDoc) {
        return (
            <div className='loading-page'>
                <Loader
                    type='Oval'
                    width={120}
                    height={120}
                    color='blue'
                />
            </div>
        )
    }

    if (userDoc.perms === Perms.Student) {
        return <StudentDashboard user={userDoc} />
    }

    return <TeacherDashboard user={userDoc} />
}
