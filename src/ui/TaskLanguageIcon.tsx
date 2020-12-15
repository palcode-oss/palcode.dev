import React, { useMemo } from 'react';
import { TaskLanguage } from '../types';
import { getLanguages, LanguageData } from '../helpers/languageData';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        <FontAwesomeIcon
            icon={languageData.icon}
            color={languageData.iconColor}
            size='lg'
            style={{
                marginRight: 10,
                marginLeft: 5,
            }}
        />
    );
}
