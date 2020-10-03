import React, { ReactElement } from 'react';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';

export default function Files(
    {
        files,
        onTabSelect,
        selectedFile,
        onNewFile,
    }: {
        files: string[],
        selectedFile: string,
        onTabSelect(fileName: string): void,
        onNewFile(): void,
    }
): ReactElement {
    return (
        <div className={editor.filesContainer}>
            <button
                className={editor.newFile}
                onClick={onNewFile}
                title='New file'
            >
                <FontAwesomeIcon icon={faFile} />
            </button>

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
        </div>
    );
}
