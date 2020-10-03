import { useParams } from 'react-router-dom';
import React, { ReactElement } from 'react';
import { Shimmer } from 'react-shimmer';
import { useClassroom } from './helpers/classroom';
import codePage from './styles/codePage.module.scss';

interface Params {
    classroomId: string;
}

export default function CodePage(): ReactElement {
    const {classroomId} = useParams<Params>();

    const classroom = useClassroom(classroomId);

    return (
        <div className={codePage.page}>
            <h3 className={codePage.title}>
                You're joining the classroom '
                {
                    classroom?.name || (
                        <Shimmer
                            height={25}
                            width={150}
                            className={codePage.shimmer}
                        />
                    )
                }
                '.
            </h3>
            <div className={codePage.code}>
                {
                    classroom?.code || (
                        <Shimmer
                            height={55}
                            width={250}
                            className={codePage.shimmer}
                        />
                    )
                }
            </div>
            <div className={codePage.instruction}>
                <p>
                    Visit&nbsp;
                    <strong>
                        https://palcode.dev/classroom/join
                    </strong>
                    &nbsp;and enter this code to add yourself to this classroom. You'll need to sign up or sign in
                    first.
                </p>
            </div>
        </div>
    );
}
