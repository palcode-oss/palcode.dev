import { Classroom, TaskType } from '../helpers/types';
import React, { MouseEvent, ReactElement } from 'react';
import { Shimmer } from 'react-shimmer';
import { useUser } from '../helpers/auth';
import { Link } from 'react-router-dom';

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
            className='classroom-card'
            to={`/classroom/${classroom.id}/view`}
        >
            <h2 className='classroom-name'>
                {classroom.name}
            </h2>
            <h3 className='classroom-owner'>
                {
                    !loading && owner
                        ? owner.displayName
                        : (
                            <Shimmer
                                height={12}
                                width={100}
                                className='shimmer'
                            />
                        )
                }
            </h3>
            <p className='classroom-task-count'>
                {
                    tasks
                }
                &nbsp;task{tasks !== 1 ? 's' : ''}
            </p>
        </Link>
    );
}
