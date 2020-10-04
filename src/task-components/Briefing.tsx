import React, { ReactElement } from 'react';
import useBriefing from '../helpers/taskBriefing';
import ReactMarkdown from 'react-markdown';
import editor from '../styles/editor.module.scss';
import BriefingSyntaxHighlighter from './briefing-renderers/BriefingSyntaxHighlighter';
import BriefingImage from './briefing-renderers/BriefingImage';
import { BriefingTable, BriefingTableCell } from './briefing-renderers/BriefingTable';
import { Shimmer } from 'react-shimmer';
import loader from '../styles/loader.module.scss';
import briefingRenderer from '../styles/briefing-renderer.module.scss';
import { Task } from '../helpers/types';
import BriefingLink from './briefing-renderers/BriefingLink';
import BriefingListItem from './briefing-renderers/BriefingListItem';

export default function Briefing(
    {
        taskId,
        task,
        taskLoading,
    } : {
        taskId: string,
        task: Task | null,
        taskLoading: boolean,
    }
): ReactElement {
    const briefing = useBriefing(taskId);

    return (
        <div className={editor.briefingText}>
            {
                taskLoading && (
                    <Shimmer
                        height={30}
                        width={200}
                        duration={1000}
                        className={loader.grayShimmer}
                    />
                )
            }

            {
                !taskLoading && (
                    <h1
                        className={briefingRenderer.briefingTitle}
                    >
                        {
                            task?.name
                        }
                    </h1>
                )
            }

            <ReactMarkdown
                source={briefing}
                renderers={{
                    code: BriefingSyntaxHighlighter,
                    image: BriefingImage,
                    table: BriefingTable,
                    tableCell: BriefingTableCell,
                    link: BriefingLink,
                    listItem: BriefingListItem,
                }}
            />
        </div>
    )
}
