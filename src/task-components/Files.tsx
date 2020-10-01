import React, { ReactElement } from 'react';

export default function Files(
    {
        files,
        onTabSelect
    }: {
        files: string[],
        onTabSelect(fileName: string): void,
    }
): ReactElement {
    return (
        <ul className='files'>
            { files.map(file => (
                <li
                    key={file}
                >
                    <a
                        href='#'
                        className='file'
                        onClick={() => onTabSelect(file)}
                    >
                        {file}
                    </a>
                </li>
            )) }
        </ul>
    );
}
