import { TaskLanguage } from '../types';
import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faNodeJs } from '@fortawesome/free-brands-svg-icons/faNodeJs';
import { faPython } from '@fortawesome/free-brands-svg-icons/faPython';
import { faTerminal } from '@fortawesome/free-solid-svg-icons/faTerminal';

export function getLanguageDefaultFile(language: TaskLanguage): string {
    switch (language) {
        case 'python': return 'index.py';
        case 'nodejs': return 'index.js';
        case 'bash': return 'main.sh';
    }
}

export interface LanguageData {
    code: TaskLanguage,
    displayName: string,
    icon: IconDefinition,
    iconColor: string,
}

export function getLanguages(): LanguageData[] {
    return [
        {
            code: 'nodejs',
            displayName: 'Node.JS',
            icon: faNodeJs,
            iconColor: '#679e63',
        },
        {
            code: 'python',
            displayName: 'Python',
            icon: faPython,
            iconColor: '#030027',
        },
        {
            code: 'bash',
            displayName: 'Bash',
            icon: faTerminal,
            iconColor: '#030027',
        }
    ];
}
