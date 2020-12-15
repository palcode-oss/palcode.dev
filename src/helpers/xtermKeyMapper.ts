export default function normaliseKey(stdout: string): string {
    let finalString = stdout;

    if (finalString === '^[[D') {
        finalString = '\x1b[D';
    } else if (finalString === '^[[C') {
        finalString = '\x1b[C';
    } else if (['^[[A', '^[[B'].includes(finalString)) {
        finalString = '';
    }

    return finalString;
}
