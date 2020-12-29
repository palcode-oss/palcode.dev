import { TaskLanguage } from '../types';

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
            icon: require('../language-icons/node.png'),
        },
        {
            code: 'python',
            extension: 'py',
            displayName: 'Python',
            icon: require("../language-icons/python.png"),
        },
        {
            code: 'java',
            extension: 'java',
            displayName: 'Java',
            icon: require("../language-icons/java.png"),
        },
        {
            code: 'prolog',
            extension: 'pl',
            displayName: 'Prolog',
            icon: require("../language-icons/prolog.png"),
        },
        {
            code: 'bash',
            extension: 'sh',
            displayName: 'Bash',
            icon: require("../language-icons/bash.png"),
        },
        {
            code: 'go',
            extension: 'go',
            displayName: 'Golang',
            icon: require("../language-icons/go.png"),
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
