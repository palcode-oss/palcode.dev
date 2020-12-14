import { useEffect, useState } from 'react';
import axios from 'axios';
import getEnvVariable from './getEnv';

export default function useBriefing(taskId: string): string {
    const [briefingContent, setBriefingContent] = useState('');

    useEffect(() => {
        axios.get(
            getEnvVariable('API') + '/get-file',
            {
                params: {
                    projectId: taskId,
                    fileName: 'README.md',
                }
            }
        )
            .then(response => {
                if (!response.data || response.status !== 200) {
                    setBriefingContent('Failed to load briefing.');
                } else {
                    setBriefingContent(response.data);
                }
            });
    }, [taskId]);

    return briefingContent;
}
