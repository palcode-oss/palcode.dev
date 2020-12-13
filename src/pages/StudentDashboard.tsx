import React, { lazy, ReactElement, Suspense } from 'react';
import { User } from '../types';
import Loader from 'react-loader-spinner';
import { useClassrooms } from '../helpers/classroom';
import studentDashboard from '../styles/studentDashboard.module.scss';
import loader from '../styles/loader.module.scss';
import LazyComponentFallback from '../ui/LazyComponentFallback';
import PrivateTasks from '../ui/PrivateTasks';
import Spinner from '../ui/Spinner';

const ClassroomCard = lazy(() => import('../ui/ClassroomCard'));

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classrooms, classroomsLoading] = useClassrooms(user.username);

    return (
        <div className={studentDashboard.dashboard}>
            <div className={studentDashboard.header}>
                <h1>
                    My classrooms
                </h1>
            </div>
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
            <PrivateTasks />
        </div>
    );
}
