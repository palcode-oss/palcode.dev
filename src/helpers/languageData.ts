import { TaskLanguage } from '../types';
import node from '../language-icons/node.png';
import python from '../language-icons/python.png';
import go from '../language-icons/go.png';
import bash from '../language-icons/bash.png';
import prolog from '../language-icons/prolog.png';
import java from '../language-icons/java.png';

export function getLanguageDefaultFile(language: TaskLanguage): string {
    switch (language) {
        case 'python': return 'main.py';
        case 'nodejs': return 'index.js';
        case 'bash': return 'main.sh';
        case 'java': return 'Main.java';
        case 'prolog': return 'main.pl';
        case 'go': return 'main.go';
    }
}

export interface LanguageData {
    code: TaskLanguage,
    extension: string,
    displayName: string,
    icon: string,
}

export function getLanguages(): LanguageData[] {
    return [
        {
            code: 'nodejs',
            extension: 'js',
            displayName: 'Node.JS',
            icon: node,
        },
        {
            code: 'python',
            extension: 'py',
            displayName: 'Python',
            icon: python,
        },
        {
            code: 'java',
            extension: 'java',
            displayName: 'Java',
            icon: java,
        },
        {
            code: 'prolog',
            extension: 'pl',
            displayName: 'Prolog',
            icon: prolog,
        },
        {
            code: 'bash',
            extension: 'sh',
            displayName: 'Bash',
            icon: bash,
        },
        {
            code: 'go',
            extension: 'go',
            displayName: 'Golang',
            icon: go,
        }
    ];
}

export function getLanguageFromExtension(extension: string): TaskLanguage | void {
    const languages = getLanguages();
    const language = languages.find(language => {
        return language.extension === extension;
    });

    if (language) {
        return language.code;
    }
}
