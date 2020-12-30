import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { TaskLanguage } from '../types';
import getEnvVariable from './getEnv';
import { useSchoolId } from './school';
import useAPIToken from './apiToken';
import cancellableRequest from './requestCanceller';

type Files = string[];
type FilesLoading = boolean;
type AddFile = (fileName: string) => void;
type DeleteFile = (fileName: string) => void;

export function useTaskFiles(taskId: string, language?: TaskLanguage): [Files, FilesLoading, AddFile, DeleteFile] {
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const schoolId = useSchoolId();
    const token = useAPIToken();

    useEffect(() => {
        if (!language || !schoolId || !token) return;

        axios.get(
            getEnvVariable('API') + '/get-file-list',
            {
                params: {
                    projectId: taskId,
                    language,
                    schoolId,
                    token,
                },
                withCredentials: true,
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
    }, [taskId, language, schoolId, token]);

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

type Downloading = boolean;
type FileContent = string;
type Uploading = boolean;
type SetFileContent = (fileContent: string) => void;

export function useFileContent(taskId: string, fileName: string): [Downloading, FileContent, Uploading, SetFileContent] {
    const [fileContent, setFileContent] = useState('');
    const [downloading, setDownloading] = useState(true);
    const [initialDownloadComplete, setInitialDownloadComplete] = useState(false);

    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [saving, setSaving] = useState(false);

    const schoolId = useSchoolId();
    const token = useAPIToken();

    useEffect(() => {
        setInitialDownloadComplete(false);
        setFileContent('');
        setDownloading(true);
    }, [fileName, taskId]);

    useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (!initialDownloadComplete || !schoolId || !token) {
            return;
        }

        timeout.current = setTimeout(() => {
            setSaving(true);
            cancellableRequest(
                'save-task',
                'POST',
                getEnvVariable('API') + '/save',
                {
                    data: {
                        projectId: taskId,
                        files: [{
                            name: fileName,
                            content: fileContent,
                        }],
                        schoolId,
                        token,
                    },
                    withCredentials: true,
                }
            )
                .then(() => setSaving(false))
                .catch((e) => {
                    if (!axios.isCancel(e)) {
                        setSaving(false);
                    }
                })
        }, 400);
    }, [fileContent, fileName, taskId, initialDownloadComplete, timeout, schoolId, token]);

    useEffect(() => {
        if (initialDownloadComplete || !schoolId || !token) {
            return;
        }

        axios.get(
            getEnvVariable('API') + '/get-file',
            {
                params: {
                    projectId: taskId,
                    fileName,
                    schoolId,
                    token,
                },
                withCredentials: true,
                transformResponse: (res) => res,
            }
        )
            .then(response => {
                setDownloading(false);
                setInitialDownloadComplete(true);
                setFileContent(response.data);
            })
            .catch(() => {
                setDownloading(false);
                setInitialDownloadComplete(true);
                setFileContent('');
            })
    }, [taskId, fileName, initialDownloadComplete, schoolId, token]);

    return [downloading, fileContent, saving, setFileContent];
}

export function deleteRemoteFile(taskId: string, fileName: string, schoolId: string, token: string,) {
    return axios.post(getEnvVariable('API') + '/delete-file', {
        projectId: taskId,
        fileName,
        schoolId,
        token,
    }, {
        withCredentials: true,
    });
}
