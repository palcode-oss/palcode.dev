import React, { ReactElement, useEffect, useState } from 'react';
import { Classroom, User } from './helpers/types';
import firebase from 'firebase';
import 'firebase/firestore';
import Loader from 'react-loader-spinner';
import ClassroomCard from './ui/ClassroomCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Link } from 'react-router-dom';
import { useClassrooms } from './helpers/classroom';
import studentDashboard from './styles/studentDashboard.module.scss';

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classrooms, classroomsLoading] = useClassrooms(user.uid);

    return (
        <div className={studentDashboard.dashboard}>
            <div className={studentDashboard.header}>
                <h1>
                    My classrooms
                </h1>
                <Link to='/classroom/join'>
                    <FontAwesomeIcon icon={faPlus}/>
                </Link>
            </div>
            {
                classroomsLoading ? (
                    <Loader
                        type='Oval'
                        width={120}
                        height={120}
                        color='blue'
                    />
                ) : (
                    <div className={studentDashboard.classroomCardContainer}>
                        {
                            !classrooms.length && (
                                <p>
                                    You're not a part of any classrooms yet. Click the&nbsp;
                                    <FontAwesomeIcon icon={faPlus}/>
                                    &nbsp;button above to get started.
                                </p>
                            )
                        }
                        {
                            classrooms.map(classroom => (
                                <ClassroomCard
                                    classroom={classroom}
                                    key={classroom.id}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
