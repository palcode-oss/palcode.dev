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
    }
];
