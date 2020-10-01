import { useParams } from "react-router-dom";
import React, { ReactElement, useEffect, useState } from 'react';
import { Shimmer } from 'react-shimmer';

import firebase from 'firebase';
import 'firebase/firestore';
import { Classroom } from './helpers/types';

interface Params {
    classroomId: string;
}

export default function CodePage(): ReactElement {
    const { classroomId } = useParams<Params>();

    const [code, setCode] = useState<string | null>(null);
    useEffect(() => {
        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroomId)
            .get()
            .then(doc => {
                const data = doc.data() as Classroom;
                setCode(data.code);
            });
    }, [classroomId]);

    return (
        <div className='code-page'>
            <div className='code'>
                {
                    code || (
                        <Shimmer
                            height={24}
                            width={200}
                            className='shimmer'
                        />
                    )
                }
            </div>
        </div>
    )
}
