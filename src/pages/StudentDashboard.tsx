import React, { lazy, ReactElement, Suspense, useState } from 'react';
import { User } from '../types';
import { useClassrooms } from '../helpers/classroom';
import studentDashboard from '../styles/studentDashboard.module.scss';
import LazyComponentFallback from '../ui/LazyComponentFallback';
import Spinner from '../ui/Spinner';
import TabSwitcher from '../ui/TabSwitcher';

const ClassroomCard = lazy(() => import('../components/ClassroomCard'));
const PrivateTasks = lazy(() => import('../components/PrivateTasks'));

enum TabSelection {
    Classrooms,
    PrivateProjects,
}

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classrooms, classroomsLoading] = useClassrooms(user.username);
    const [tab, setTab] = useState<TabSelection>(TabSelection.Classrooms);

    return (
        <div className={studentDashboard.dashboard}>
            <div className={studentDashboard.header}>
                <h1>My dashboard</h1>
            </div>

            <TabSwitcher
                tabs={['Classrooms', 'Private projects']}
                tab={tab}
                onChange={setTab}
            />

            <Suspense fallback={<LazyComponentFallback />}>
                {tab === TabSelection.PrivateProjects && <>
                    <PrivateTasks />
                </>}
            </Suspense>

            {tab === TabSelection.Classrooms && <>
                {
                    classroomsLoading ? (
                        <Spinner />
                    ) : (
                        <div className={studentDashboard.classroomCardContainer}>
                            {
                                !classrooms.length && (
                                    <p>
                                        You're not a part of any classrooms yet. They'll appear here once your teacher
                                        adds you to a classroom.
                                    </p>
                                )
                            }
                            <Suspense fallback={<LazyComponentFallback />}>
                                {
                                    classrooms.map(classroom => (
                                        <ClassroomCard
                                            classroom={classroom}
                                            key={classroom.id}
                                        />
                                    ))
                                }
                            </Suspense>
                        </div>
                    )
                }
            </>}
        </div>
    );
}
