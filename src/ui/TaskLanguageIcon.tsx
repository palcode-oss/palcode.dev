import React, { useMemo } from 'react';
import {  languageData, SupportedLanguage } from 'palcode-types';
import { getLanguages, LanguageIconData } from '../helpers/languageData';

export default function TaskLanguageIcon(
    {
        language: languageCode,
    }: {
        language?: SupportedLanguage,
    }
) {
    const language = useMemo<LanguageIconData | undefined>(() => {
        const languageDefinition = getLanguages().find(e => e.code === languageCode);
        if (languageDefinition) {
            return languageDefinition;
        }
    }, [languageCode]);

    if (!language) {
        return <></>;
    }

    return (
        <img
            src={language.icon}
            width={18}
            alt='Language icon'
            style={{
                marginRight: 10,
                marginLeft: 5,
                display: 'inline-block',
                verticalAlign: 'middle',
            }}
        />
    );
}
