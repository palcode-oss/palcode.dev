import React, { ReactElement } from 'react';
import editor from '../styles/editor.module.scss';

export default function Files(
    {
        files,
        onTabSelect,
        selectedFile,
    }: {
        files: string[],
        selectedFile: string,
        onTabSelect(fileName: string): void,
    }
): ReactElement {
    return (
        <ul className={editor.files}>
            { files.map(file => (
                <li
                    key={file}
                    className={file === selectedFile ? editor.fileSelected : editor.file}
                >
                    <a
                        href='#'
                        onClick={() => onTabSelect(file)}
                    >
                        {file}
                    </a>
                </li>
            )) }
        </ul>
    );
}
