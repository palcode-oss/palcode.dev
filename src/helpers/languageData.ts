import { TaskLanguage } from '../types';

export function getLanguageDefaultFile(language: TaskLanguage): string {
    switch (language) {
        case 'python': return 'main.py';
        case 'nodejs': return 'index.js';
        case 'bash': return 'main.sh';
        case 'java': return 'Main.java';
    }
}

export interface LanguageData {
    code: TaskLanguage,
    displayName: string,
    icon: string,
    iconColor: string,
}

export function getLanguages(): LanguageData[] {
    return [
        {
            code: 'nodejs',
            displayName: 'Node.JS',
            icon: require('../language-icons/node.png'),
            iconColor: '#679e63',
        },
        {
            code: 'python',
            displayName: 'Python',
            icon: require("../language-icons/python.png"),
            iconColor: '#030027',
        },
        {
            code: 'java',
            displayName: 'Java',
            icon: require("../language-icons/java.png"),
            iconColor: '#5382a1',
        },
        {
            code: 'bash',
            displayName: 'Bash',
            icon: require("../language-icons/bash.png"),
            iconColor: '#030027',
        }
    ];
}
