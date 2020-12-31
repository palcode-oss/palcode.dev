import { Classroom } from '../types';
import React, { ReactElement } from 'react';
import { Shimmer } from 'react-shimmer';
import { useUser } from '../helpers/auth';
import { Link } from 'react-router-dom';
import studentDashboard from '../styles/studentDashboard.module.scss';
import { useClassroomTasks } from '../helpers/taskData';
import { ProjectType } from 'palcode-types';

interface Props {
    classroom: Classroom;
}

export default function ClassroomCard(
    {
        classroom,
    }: Props,
): ReactElement {
    const [owner, loading] = useUser(classroom.owner);
    const [tasks, tasksLoading] = useClassroomTasks(classroom.id, true);
    const taskCount = tasks
        .filter(task => task.type === ProjectType.Template)
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
                    !tasksLoading
                        ? (
                            <>
                                {
                                    taskCount
                                }
                                &nbsp;task{taskCount !== 1 ? 's' : ''}
                            </>
                        ) : (
                            <Shimmer
                                height={12}
                                width={100}
                                className={studentDashboard.shimmer}
                            />
                        )
                }
            </p>
        </Link>
    );
}
