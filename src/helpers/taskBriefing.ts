import { useEffect, useState } from 'react';
import axios from 'axios';
import getEnvVariable from './getEnv';
import { useSchoolId } from './school';

export default function useBriefing(taskId: string): string {
    const schoolId = useSchoolId();
    const [briefingContent, setBriefingContent] = useState('');

    useEffect(() => {
        if (!schoolId) return;

        axios.get(
            getEnvVariable('API') + '/get-file',
            {
                params: {
                    projectId: taskId,
                    fileName: 'README.md',
                    schoolId,
                },
                withCredentials: true,
            }
        )
            .then(response => {
                if (!response.data || response.status !== 200) {
                    setBriefingContent('Failed to load briefing.');
                } else {
                    setBriefingContent(response.data);
                }
            })
            .catch(() => {});
    }, [taskId, schoolId]);

    return briefingContent;
}
