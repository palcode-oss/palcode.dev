import React, { ReactElement } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BriefingSyntaxHighlighter(
    {
        language,
        value,
    }: {
        language: string,
        value: string,
    }
): ReactElement {
    return <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
            fontSize: 14
        }}
    >
        {value}
    </SyntaxHighlighter>
}
