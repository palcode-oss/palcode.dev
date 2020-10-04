import React, { ReactElement } from 'react';
import briefingRenderer from '../../styles/briefing-renderer.module.scss';

export default function BriefingListItem(
    {
        children,
    }: {
        children: ReactElement[],
    }
) {
    return (
        <li
            className={briefingRenderer.listItem}
        >
            {children}
        </li>
    );
}
