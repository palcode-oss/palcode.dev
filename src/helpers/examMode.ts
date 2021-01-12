import { useEffect, useMemo, useState } from 'react';
import { ProjectType } from 'palcode-types';
import { Task } from '../types';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import getEnvVariable from './getEnv';
import useAPIToken from './apiToken';

export default function useExamMode(
    teacherView?: boolean,
    task?: Task,
) {
    const isExamMode = useMemo(() => {
        return task?.examMode && task.type === ProjectType.Submission && !teacherView;
    }, [teacherView, task]);

    const {enqueueSnackbar} = useSnackbar();
    const [breachSource, setBreachSource] = useState<undefined | string>();
    const token = useAPIToken();
    useEffect(() => {
        if (!breachSource || !task || !token) return;

        axios.post(
            getEnvVariable('API') + `/projects/${task.id}/exam/breach`,
            {
                breachSource,
                token,
            }
        )
            .catch(() => {})
            .finally(() => {
                enqueueSnackbar('Exam Mode breach detected! This has been reported to your teacher.', {
                    variant: 'error',
                });
            });
    }, [breachSource, task, token]);

    useEffect(() => {
        if (!isExamMode || !task || !token) return;

        axios.post(
            getEnvVariable('API') + `/projects/${task.id}/exam/start`,
            {
                token,
            }
        )
            .then(() => {
                enqueueSnackbar('Task is in Exam Mode. Please stay on full-screen.', {
                    variant: 'warning',
                });
            })
            .catch(() => {});

        document.documentElement.requestFullscreen()
            .catch(() => {});

        const fullScreenListener = () => {
            if (!document.fullscreenElement) {
                setBreachSource('full_screen');
            }
        }
        document.documentElement.addEventListener('fullscreenchange', fullScreenListener);

        const visibilityListener = () => {
            if (document.visibilityState === 'hidden') {
                setBreachSource('focus_lost');
            }
        }
        document.addEventListener('visibilitychange', visibilityListener);

        let devToolsIsOpen = false;
        const testElement = new Image(); // create a complex binary element. the only way to render is by calling get() on testElement.id
        Object.defineProperty(testElement, 'id', {
            // consoles are lazy to improve performance, so only compute objects when the console is open
            get() {
                // if this function is called, the console must be open
                devToolsIsOpen = true;
                throw new Error();
            }
        });

        const runDevToolsCheck = () => {
            devToolsIsOpen = false;
            console.dir(testElement);
            if (devToolsIsOpen) {
                setBreachSource('inspector_console');
            }
        }

        let devToolsInterval = setInterval(runDevToolsCheck, 100);

        return () => {
            document.documentElement.removeEventListener("fullscreenchange", fullScreenListener);
            document.removeEventListener("visibilitychange", visibilityListener);
            clearInterval(devToolsInterval);
        }
    }, [task, token]);
}
