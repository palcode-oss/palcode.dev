import React, { ReactElement } from 'react';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Files(
    {
        files,
        onTabSelect,
        onFileDelete,
        selectedFile,
        onNewFile,
        readOnly,
        showReadme,
    }: {
        files: string[],
        selectedFile: string,
        readOnly: boolean,
        showReadme: boolean,
        onTabSelect(fileName: string): void,
        onNewFile(): void,
        onFileDelete(fileName: string): void,
    }
): ReactElement {
    return (
        <div className={editor.filesContainer}>
            {!readOnly &&
                <button
                    className={editor.newFile}
                    onClick={onNewFile}
                    title='New file'
                >
                    <FontAwesomeIcon icon={faFile}/>
                    &nbsp; New file
                </button>
            }

            <ul className={editor.files}>
                {
                    showReadme && (
                        <li
                            className={selectedFile === 'README.md' ? editor.fileSelected : editor.file}
                        >
                            <a
                                href='#'
                                onClick={() => onTabSelect('README.md')}
                            >
                                README.md
                            </a>
                        </li>
                    )
                }
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

                        {
                            file === selectedFile
                            && !readOnly
                            && <a
                                href='#'
                                onClick={() => onFileDelete(file)}
                                className={editor.fileDelete}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                />
                            </a>
                        }
                    </li>
                )) }
            </ul>
        </div>
    );
}
