import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export function useTaskFiles(taskId: string, currentTab: string): [string[], boolean] {
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(
            process.env.REACT_APP_API + '/get-file-list',
            {
                params: {
                    projectId: taskId,
                }
            }
        )
            .then(response => {
                setLoading(false);
                if (response.status !== 200) {
                    return;
                }

                setFiles(response.data);
            })
    }, [taskId, currentTab]);

    return [files, loading];
}

export function useFileContent(taskId: string, fileName: string): [boolean, string, (fileContent: string) => void] {
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [initialDownloadComplete, setInitialDownloadComplete] = useState(false);

    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setInitialDownloadComplete(false);
        setFileContent('');
        setLoading(true);
    }, [fileName]);

    useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (!initialDownloadComplete || saving) {
            return;
        }

        timeout.current = setTimeout(() => {
            if (saving) {
                return;
            }

            setSaving(true);
            axios.post(
                process.env.REACT_APP_API + '/save',
                {
                    projectId: taskId,
                    files: [{
                        name: fileName,
                        content: fileContent,
                    }],
                }
            ).then(() => setSaving(false));
        }, 1500);
    }, [fileContent, fileName, taskId, initialDownloadComplete, timeout]);

    useEffect(() => {
        if (initialDownloadComplete) {
            return;
        }

        axios.get(
            process.env.REACT_APP_API + '/get-file',
            {
                params: {
                    projectId: taskId,
                    fileName: fileName,
                }
            }
        )
            .then(response => {
                setLoading(false);
                if (response.status !== 200) {
                    return;
                }

                setInitialDownloadComplete(true);
                setFileContent(response.data);
            });
    }, [taskId, fileName, initialDownloadComplete]);

    return [loading, fileContent, setFileContent];
}
