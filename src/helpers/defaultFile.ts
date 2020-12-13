import { TaskLanguage } from '../types';

export default function getLanguageDefaultFile(language: TaskLanguage): string {
    switch (language) {
        case 'python': return 'index.py';
        case 'nodejs': return 'index.js';
    }
}
