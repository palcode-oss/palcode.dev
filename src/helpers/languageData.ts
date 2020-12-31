import node from '../language-icons/node.png';
import python from '../language-icons/python.png';
import go from '../language-icons/go.png';
import bash from '../language-icons/bash.png';
import prolog from '../language-icons/prolog.png';
import java from '../language-icons/java.png';
import cpp from '../language-icons/cpp.png';
import { languageData, SupportedLanguage } from 'palcode-types';

export function getLanguageDefaultFile(languageName: SupportedLanguage): string {
    const language = languageData.find(e => e.names.code === languageName);
    if (!language) {
        return 'main.txt';
    }

    return language.entrypoint;
}

export interface LanguageIconData {
    code: SupportedLanguage,
    icon: string,
}

export function getLanguages(): LanguageIconData[] {
    return [
        {
            code: 'nodejs',
            icon: node,
        },
        {
            code: 'python',
            icon: python,
        },
        {
            code: 'java',
            icon: java,
        },
        {
            code: 'prolog',
            icon: prolog,
        },
        {
            code: 'bash',
            icon: bash,
        },
        {
            code: 'go',
            icon: go,
        },
        {
            code: 'cpp',
            icon: cpp,
        },
    ];
}

export function getLanguageFromExtension(extension: string): SupportedLanguage | void {
    const language = languageData.find(language => {
        return language.extension === extension;
    });

    if (language) {
        return language.names.code;
    }
}
