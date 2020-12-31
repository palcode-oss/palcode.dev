import React, { FormEvent, useCallback, useMemo } from 'react';
import { isSubmissionTask, Task } from '../types';
import form from '../styles/form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEject, faPaperPlane, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { availableThemes } from '../helpers/monacoThemes';
import { partition } from 'lodash';
import { ProjectStatus } from 'palcode-types';

const groupedThemes = partition(availableThemes, 'light')
    .sort((a) => {
        if (a[0].light === true) {
            return 1;
        } else {
            return -1;
        }
    });

export default function Controls(
    {
        taskId,
        task,
        onClosePress,
        themeDisplayName,
        onThemeChange,
    }: {
        taskId: string,
        task: Task | null,
        onClosePress(): void,
        themeDisplayName: string,
        onThemeChange(themeDisplayName: string): void,
    }
) {
    const submissionStatus = useMemo<ProjectStatus | null>(() => {
        if (!task || !isSubmissionTask(task)) {
            return null;
        }

        if (!Number.isInteger(task.status)) {
            return ProjectStatus.Unsubmitted;
        }

        return task.status;
    }, [task]);

    const onButtonPress = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const targetSubmissionStatus: ProjectStatus = submissionStatus === ProjectStatus.Unsubmitted
            ? ProjectStatus.Submitted :
            ProjectStatus.Unsubmitted;

        const taskDoc = firebase.firestore()
            .collection('tasks')
            .doc(taskId)

        await taskDoc
            .update({
                status: targetSubmissionStatus,
            });

        await taskDoc
            .collection('statusUpdates')
            .add({
                status: targetSubmissionStatus,
                createdAt: firebase.firestore.Timestamp.now(),
            });
    }, [submissionStatus, taskId]);

    const CloseBriefing = useMemo(() => () => {
        return (
            <button
                className={form.button}
                type='button'
                onClick={onClosePress}
            >
                <FontAwesomeIcon icon={faTimesCircle} />
                Close briefing
            </button>
        );
    }, [onClosePress]);

    const ThemeSelector = useMemo(() => () => {
        return (
            <select
                value={themeDisplayName}
                onChange={(e) => onThemeChange(e.target.value)}
                className={`${form.select} ${form.themeSelector}`}
            >
                {groupedThemes.map(themeGroup => (
                    <optgroup
                        label={themeGroup[0].light === true ? 'Light themes': 'Dark themes'}
                        key={themeGroup[0].light ? 'l' : 'd'}
                    >
                        {themeGroup.map(themePair => (
                            <option
                                key={themePair.normalisedName}
                                value={themePair.displayName}
                            >
                                {themePair.displayName}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        );
    }, [themeDisplayName, onThemeChange]);

    if (submissionStatus === null) {
        return (
            <form
                className={form.form}
                onSubmit={() => {}}
            >
                <CloseBriefing />
                <ThemeSelector />
            </form>
        );
    }

    return <>
        <form
            className={form.form}
            onSubmit={onButtonPress}
        >
            <CloseBriefing />

            <button
                className={form.button}
                type='submit'
            >
                {
                    submissionStatus === ProjectStatus.Unsubmitted && <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Submit task
                    </>
                }
                {
                    [ProjectStatus.Submitted, ProjectStatus.HasFeedback].includes(submissionStatus) && <>
                        <FontAwesomeIcon icon={faEject} />
                        Unsubmit
                    </>
                }
            </button>

            <ThemeSelector />
        </form>
    </>;
}
