import React, { useMemo } from 'react';
import { TaskLanguage } from '../types';
import { getLanguages, LanguageData } from '../helpers/languageData';

export default function TaskLanguageIcon(
    {
        language,
    }: {
        language?: TaskLanguage,
    }
) {
    const languageData = useMemo<LanguageData | undefined>(() => {
        const languageDefinition = getLanguages().find(e => e.code === language);
        if (languageDefinition) {
            return languageDefinition;
        }
    }, [language]);

    if (!languageData) {
        return <></>;
    }

    return (
        <img
            src={languageData.icon}
            height={20}
            alt={languageData.displayName}
            style={{
                marginRight: 10,
                marginLeft: 5,
                display: 'inline-block',
                verticalAlign: 'middle',
            }}
        />
    );
}
