import React, { ReactElement } from 'react';
import briefingRenderer from '../../styles/briefing-renderer.module.scss';

export function BriefingTable(
    {
        children,
    }: {
        children: ReactElement[]
    }
): ReactElement {
    return (
        <table
            className={briefingRenderer.table}
        >
            {children}
        </table>
    )
}

export function BriefingTableCell(
    {
        isHeader,
        children,
    }: {
        isHeader: boolean,
        children: ReactElement[]
    }
): ReactElement {
    return (
        <td
            className={isHeader ? briefingRenderer.tableHeaderCell : briefingRenderer.tableCell}
        >
            {children}
        </td>
    )
}
