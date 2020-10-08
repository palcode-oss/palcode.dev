import React from 'react';
import { ReactElement } from 'react';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar(
    {
        onInfoClick,
    }: {
        onInfoClick(): void,
    }
): ReactElement {
    return (
        <>
            <button
                className={editor.sidebarButton}
                title='View briefing'
                onClick={onInfoClick}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
        </>
    )
}
