import { Classroom, TaskType } from '../helpers/types';
import React, { MouseEvent, ReactElement } from 'react';
import { Shimmer } from 'react-shimmer';
import { useUser } from '../helpers/auth';
import { Link } from 'react-router-dom';
import studentDashboard from '../styles/studentDashboard.module.scss';

interface Props {
    classroom: Classroom;
}

export default function ClassroomCard(
    {
        classroom,
    }: Props,
): ReactElement {
    const [owner, loading] = useUser(classroom.owner);
    const tasks = classroom
        .tasks
        .filter(task => task.type === TaskType.Template)
        .length;

    return (
        <Link
            className={studentDashboard.classroomCard}
            to={`/classroom/${classroom.id}/view`}
        >
            <h2 className={studentDashboard.name}>
                {classroom.name}
            </h2>
            <h3 className={studentDashboard.owner}>
                {
                    !loading && owner
                        ? owner.displayName
                        : (
                            <Shimmer
                                height={18}
                                width={120}
                                className={studentDashboard.shimmer}
                            />
                        )
                }
            </h3>
            <p className={studentDashboard.taskCount}>
                {
                    tasks
                }
                &nbsp;task{tasks !== 1 ? 's' : ''}
            </p>
        </Link>
    );
}
