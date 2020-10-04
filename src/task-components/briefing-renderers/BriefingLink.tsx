import briefingRenderer from '../../styles/briefing-renderer.module.scss';
import React, { ReactElement } from 'react';

export default function BriefingLink(
    {
        href,
        children,
    }: {
        href: string,
        children: ReactElement[],
    }
): ReactElement {
    return (
        <a
            href={href}
            className={briefingRenderer.link}
            rel='noopener'
            target='_blank'
            title='Opens in a new tab'
        >
            {children}
        </a>
    )
}
