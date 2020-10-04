import React, { ReactElement, useCallback, useRef, useState } from 'react';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from 'notistack';
import {
    completeTaskFeedback,
    deleteVoiceFeedback,
    uncompleteTaskFeedback,
    uploadVoiceFeedback,
} from '../helpers/taskFeedback';
import VoiceFeedbackPreview from './VoiceFeedbackPreview';

export default function VoiceFeedbackUpload(
    {
        taskId,
    }: {
        taskId: string,
    }
): ReactElement {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const recorder = useRef<MediaRecorder | null>(null);
    const [uploading, setUploading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [uploadMd5Hash, setUploadMd5Hash] = useState('');

    const record = useCallback(() => {
        navigator.getUserMedia(
            { audio: true },
            (stream) => {
                recorder.current = new MediaRecorder(stream);
                recorder.current.start();
                setRecording(true);

                const audioChunks: Blob[] = [];
                recorder.current.ondataavailable = e => {
                    audioChunks.push(e.data);

                    if (recorder.current?.state === 'inactive') {
                        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
                        setUploading(true);

                        enqueueSnackbar(
                            'Uploading...',
                            {
                                variant: 'info',
                                key: 'audio-upload',
                                persist: true,
                            }
                        )

                        uploadVoiceFeedback(taskId, blob)
                            .then(data => {
                                setUploading(false);
                                closeSnackbar('audio-upload');
                                enqueueSnackbar(
                                    'Upload complete!',
                                    {
                                        variant: 'success',
                                    }
                                );

                                if (data.metadata.md5Hash) {
                                    setUploadMd5Hash(data.metadata.md5Hash);
                                }

                                completeTaskFeedback(taskId);
                            })
                            .catch(() => {
                                setUploading(false);
                                closeSnackbar('audio-upload');
                                enqueueSnackbar(
                                    'Upload failed. Please ensure you have a stable network connection and try again.',
                                    {
                                        variant: 'error',
                                    }
                                );
                            });
                    }
                }
            },
            (e) => {
                if (e.name === 'NotFoundError') {
                    enqueueSnackbar(
                        'No microphone found. Please attach one and try again.',
                        {
                            preventDuplicate: true,
                            variant: 'error',
                        }
                    );
                }
            }
        );
    }, [taskId]);

    const stop = useCallback(() => {
        if (!recorder.current || recorder.current.state === 'inactive') return;
        recorder.current.stop();
        setRecording(false);
    }, [recorder]);

    const deleteFeedback = useCallback(() => {
        setUploading(true);
        enqueueSnackbar(
            'Deleting audio...',
            {
                key: 'audio-delete',
                persist: true,
                variant: 'info',
            }
        );

        deleteVoiceFeedback(taskId)
            .then(() => {
                setUploading(false);
                closeSnackbar('audio-delete');
                enqueueSnackbar(
                    'Audio removed from server successfully!',
                    {
                        variant: 'success',
                    }
                );

                setUploadMd5Hash('deleted');
                uncompleteTaskFeedback(taskId);
            })
            .catch(err => {
                setUploading(false);
                closeSnackbar('audio-delete');

                if (err.code === 'storage/object-not-found') {
                    enqueueSnackbar(
                        'No audio feedback to delete.',
                        {
                            variant: 'warning',
                        }
                    );
                } else {
                    enqueueSnackbar(
                        'Something went wrong. Please try again.',
                        {
                            variant: 'error',
                        }
                    );
                }
            });
    }, [taskId]);

    return (
        <div className={editor.voiceFeedback}>
            <button
                className={`${editor.voiceRecord} ${recording ? editor.voiceRecordActive : ''}`}
                onClick={record}
                disabled={uploading || recording}
            >
                <FontAwesomeIcon icon={faMicrophone} />
            </button>
            <button
                className={editor.voiceStop}
                onClick={stop}
                disabled={uploading || !recording}
            >
                <FontAwesomeIcon icon={faStop} />
            </button>
            <button
                className={editor.voiceDelete}
                disabled={uploading || recording}
                onClick={deleteFeedback}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>

            <VoiceFeedbackPreview
                taskId={taskId}
                md5Hash={uploadMd5Hash}
            />
        </div>
    )
}
