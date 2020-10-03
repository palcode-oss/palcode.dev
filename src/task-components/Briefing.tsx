import React, { ReactElement } from 'react';
import useBriefing from '../helpers/taskBriefing';
import ReactMarkdown from 'react-markdown';
import editor from '../styles/editor.module.scss';
import BriefingSyntaxHighlighter from './briefing-renderers/BriefingSyntaxHighlighter';
import BriefingImage from './briefing-renderers/BriefingImage';
import { BriefingTable, BriefingTableCell } from './briefing-renderers/BriefingTable';

export default function Briefing(
    {
        taskId
    } : {
        taskId: string
    }
): ReactElement {
    const briefing = useBriefing(taskId);

    return (
        <div className={editor.briefingText}>
            <ReactMarkdown
                source={briefing}
                renderers={{
                    code: BriefingSyntaxHighlighter,
                    image: BriefingImage,
                    table: BriefingTable,
                    tableCell: BriefingTableCell,
                }}
            />
        </div>
    )
}
