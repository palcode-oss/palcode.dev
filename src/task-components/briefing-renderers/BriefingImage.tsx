import React from 'react';
import briefingRenderer from '../../styles/briefing-renderer.module.scss';

export default function BriefingImage(
    {
        src,
        alt,
    }: {
        src: string,
        alt: string,
    }
) {
    return <img
        src={src}
        alt={alt}
        className={briefingRenderer.image}
    />
}
