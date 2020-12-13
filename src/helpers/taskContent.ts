import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { TaskLanguage } from '../types';

type Files = string[];
type FilesLoading = boolean;
type AddFile = (fileName: string) => void;
type DeleteFile = (fileName: string) => void;

export function useTaskFiles(taskId: string, language?: TaskLanguage): [Files, FilesLoading, AddFile, DeleteFile] {
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!language) return;

        axios.get(
            process.env.REACT_APP_API + '/get-file-list',
            {
                params: {
                    projectId: taskId,
                    language,
                }
            }
        )
            .then(response => {
                setLoading(false);

                if (response.data.length === 0) {
                    setFiles(['index.py']);
                } else {
                    setFiles(response.data);
                }
            })
            .catch(() => {
                setLoading(false);
                setFiles(['index.py'])
            });
    }, [taskId, language]);

    const addLocalFile = useCallback((fileName: string) => {
        if (files.includes(fileName)) {
            return;
        }

        setFiles([
            ...files,
            fileName
        ]);
    }, [files]);

    const deleteLocalFile = useCallback((fileName: string) => {
        if (!files.includes(fileName)) {
            return;
        }

        setFiles(files.filter(e => e !== fileName));
    }, [files]);

    return [files, loading, addLocalFile, deleteLocalFile];
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
    }, [fileName, taskId]);

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
        }, 400);
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
                setInitialDownloadComplete(true);
                setFileContent(response.data);
            })
            .catch(() => {
                setLoading(false);
                setInitialDownloadComplete(true);
                setFileContent('');
            })
    }, [taskId, fileName, initialDownloadComplete]);

    return [loading, fileContent, setFileContent];
}

export function deleteRemoteFile(taskId: string, fileName: string) {
    return axios.post(process.env.REACT_APP_API + '/delete-file', {
        projectId: taskId,
        fileName,
    });
}
