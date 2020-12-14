declare global {
    interface Window {
        PalConfig: {
            [key: string]: string | undefined,
        };
    }
}

export default function getEnvVariable(name: string): string | undefined {
    if (process.env.NODE_ENV === 'production') {
        const config = window.PalConfig;
        return config[name];
    } else{
        return process.env['REACT_APP_' + name];
    }
}
