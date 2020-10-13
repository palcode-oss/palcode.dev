import { useEffect, useState } from 'react';
import { editor } from 'monaco-editor';

export interface ThemeMetadata {
    displayName: string;
    normalisedName: string;
    light: boolean,
}

export const availableThemes: ThemeMetadata[] = [
    {
        displayName: 'Blackboard',
        normalisedName: 'blackboard',
        light: false,
    },
    {
        displayName: 'Cobalt',
        normalisedName: 'cobalt',
        light: false,
    },
    {
        displayName: 'GitHub',
        normalisedName: 'github',
        light: true,
    },
    {
        displayName: 'Brilliance Dull',
        normalisedName: 'brilliance-dull',
        light: false,
    },
    {
        displayName: 'Night Owl',
        normalisedName: 'night-owl',
        light: false,
    },
    {
        displayName: 'Tomorrow',
        normalisedName: 'tomorrow',
        light: true,
    },
    {
        displayName: 'Tomorrow-Night',
        normalisedName: 'tomorrow-night',
        light: false,
    },
    {
        displayName: 'Tomorrow-Night-Bright',
        normalisedName: 'tomorrow-night-bright',
        light: false,
    },
    {
        displayName: 'Tomorrow-Night-Blue',
        normalisedName: 'tomorrow-night-blue',
        light: false,
    },
    {
        displayName: 'Tomorrow-Night-Eighties',
        normalisedName: 'tomorrow-night-eighties',
        light: false,
    },
    {
        displayName: 'Monokai',
        normalisedName: 'monokai',
        light: false,
    },
    {
        displayName: 'Merbivore',
        normalisedName: 'merbivore',
        light: false,
    },
    {
        displayName: 'Amy',
        normalisedName: 'amy',
        light: false,
    },
    {
        displayName: 'Xcode_default',
        normalisedName: 'xcode-default',
        light: true,
    },
    {
        displayName: 'Espresso Libre',
        normalisedName: 'espresso-libre',
        light: false,
    },
    {
        displayName: 'IDLE',
        normalisedName: 'idle',
        light: true,
    },
    {
        displayName: 'Katzenmilch',
        normalisedName: 'katzenmilch',
        light: true,
    },
    {
        displayName: 'Eiffel',
        normalisedName: 'eiffel',
        light: true,
    },
];

export function useMonacoTheme(themeDisplayName?: string): [editor.IStandaloneThemeData | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [themeData, setThemeData] = useState<editor.IStandaloneThemeData | undefined>(undefined);

    useEffect(() => {
        if (!themeDisplayName) return;

        setLoading(true);
        const existingThemeString = localStorage.getItem(`Theme-${themeDisplayName}`);
        if (existingThemeString) {
            let parsedThemeData;
            try {
                parsedThemeData = JSON.parse(existingThemeString);
                setThemeData(parsedThemeData);
                setLoading(false);
                return;
            } catch (e) {
                localStorage.removeItem(`Theme-${themeDisplayName}`);
            }
        }

        fetch('https://cdn.jsdelivr.net/npm/monaco-themes@latest/themes/' + themeDisplayName + '.json')
            .then(res => res.json())
            .then(data => {
                setThemeData(data);
                setLoading(false);

                localStorage.setItem(
                    `Theme-${themeDisplayName}`,
                    JSON.stringify(data),
                );
            });
    }, [themeDisplayName]);

    return [themeData, loading];
}
