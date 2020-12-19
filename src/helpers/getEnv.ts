export default function getEnvVariable(name: string): string | undefined {
    return process.env['REACT_APP_' + name];
}
