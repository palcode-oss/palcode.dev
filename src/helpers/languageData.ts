import { TaskLanguage } from '../types';

export function getLanguageDefaultFile(language: TaskLanguage): string {
    switch (language) {
        case 'python': return 'main.py';
        case 'nodejs': return 'index.js';
        case 'bash': return 'main.sh';
        case 'java': return 'Main.java';
        case 'prolog': return 'main.pl';
    }
}

export interface LanguageData {
    code: TaskLanguage,
    displayName: string,
    icon: string,
}

export function getLanguages(): LanguageData[] {
    return [
        {
            code: 'nodejs',
            displayName: 'Node.JS',
            icon: require('../language-icons/node.png'),
        },
        {
            code: 'python',
            displayName: 'Python',
            icon: require("../language-icons/python.png"),
        },
        {
            code: 'java',
            displayName: 'Java',
            icon: require("../language-icons/java.png"),
        },
        {
            code: 'prolog',
            displayName: 'Prolog',
            icon: require("../language-icons/prolog.png"),
        },
        {
            code: 'bash',
            displayName: 'Bash',
            icon: require("../language-icons/bash.png"),
        }
    ];
}
