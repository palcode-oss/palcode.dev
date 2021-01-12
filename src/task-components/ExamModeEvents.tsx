import { useEffect, useMemo, useState } from 'react';
import { ExamEvent } from 'palcode-types';
import { Task } from '../types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import styles from '../styles/editor.module.scss';
import React from 'react';
import moment from 'moment';

export default function ExamModeEvents(
    {
        task,
    }: {
        task?: Task,
    },
) {
    const [events, setEvents] = useState<ExamEvent[]>([]);
    useEffect(() => {
        if (!task?.examMode) return;

        (async () => {
            const response = await firebase.firestore()
                .collection('tasks')
                .doc(task.id)
                .collection('examEvents')
                .orderBy('createdAt', 'asc')
                .get();

            if (response.empty) {
                return;
            }

            const mappedResponses = response.docs.map(doc => doc.data() as ExamEvent);
            setEvents(mappedResponses);
        })();
    }, [task]);

    const breachCount = useMemo(() => {
        return events.filter(e => e.event === 'breach').length;
    }, [events]);

    if (events.length === 0) {
        return <></>
    }

    return <>
        <h1 className={styles.feedbackHeader}>
            Exam Report
        </h1>

        {breachCount === 0 ? <p className={styles.breachSummaryOkay}>
            No issues.
        </p> : <p className={styles.breachSummaryIssues}>
            Breaches detected: {breachCount}
        </p>}

        {events.map(event => <div
            key={event.createdAt.seconds}
            className={styles.breachEvent}
        >
            <p
                className={styles.breachTime}
            >
                {moment(event.createdAt.toDate()).format('MMM Do, h:mm:ss a')}
            </p>
            <p
                className={styles.breachType}
            >
                {event.event === 'breach' ? 'Alert triggered' : 'Task opened'}
            </p>


            <p className={styles.breachMetadata}>
                IP Address: <span className={styles.breachMetadataValue}>{event.ip}</span>
            </p>

            {event.metadata?.breachSource && <p className={styles.breachMetadata}>
                Reason:&nbsp;
                <span className={styles.breachMetadataValue}>
                    <pre>{event.metadata.breachSource}</pre>
                </span>
            </p>}
        </div>)}
    </>
}
