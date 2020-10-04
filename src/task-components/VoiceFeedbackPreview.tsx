import React, { ReactElement, useEffect, useState } from 'react';
import { getVoiceFeedbackDownloadUrl } from '../helpers/voiceFeedback';
import editor from '../styles/editor.module.scss';

export default function VoiceFeedbackPreview(
    {
        md5Hash,
        taskId,
    }: {
        md5Hash?: string,
        taskId: string,
    }
): ReactElement {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        getVoiceFeedbackDownloadUrl(taskId)
            .then(url => {
                setAudioUrl(url);
            })
            .catch(() => {
                setAudioUrl('');
            })
    }, [taskId, md5Hash]);

    if (!audioUrl) {
        return <></>;
    }

    return (
        <audio
            controls
            className={editor.voiceFeedbackPreview}
        >
            <source
                type='audio/mp3'
                src={audioUrl}
            />
        </audio>
    );
}
