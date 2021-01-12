import React, { lazy, ReactElement, Suspense } from 'react';
import useBriefing from '../helpers/taskBriefing';
import editor from '../styles/editor.module.scss';
import { BriefingTable, BriefingTableCell } from './briefing-renderers/BriefingTable';
import { Shimmer } from 'react-shimmer';
import loader from '../styles/loader.module.scss';
import briefingRenderer from '../styles/briefing-renderer.module.scss';
import { Task } from '../types';
import LazyComponentFallback from '../ui/LazyComponentFallback';

const ReactMarkdown = lazy(() => import('react-markdown'));
const BriefingSyntaxHighlighter = lazy(() => import('./briefing-renderers/BriefingSyntaxHighlighter'));
const BriefingImage = lazy(() => import('./briefing-renderers/BriefingImage'));
const BriefingLink = lazy(() => import('./briefing-renderers/BriefingLink'));
const BriefingListItem = lazy(() => import('./briefing-renderers/BriefingListItem'));

export default function Briefing(
    {
        taskId,
        task,
        taskLoading,
    } : {
        taskId: string,
        task?: Task,
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
                !taskLoading && <>
                    {task?.examMode && <p>
                        <strong>Warning!</strong>
                        &nbsp;This task is in Exam Mode. Your browser is being closely monitored for suspicious activity.
                        Please avoid switching tabs/windows, exiting full screen, opening your browser's console, etc.
                    </p>}

                    <h1
                        className={briefingRenderer.briefingTitle}
                    >
                        {
                            task?.name
                        }
                    </h1>
                </>
            }

            <Suspense fallback={<LazyComponentFallback />}>
                <ReactMarkdown
                    source={briefing}
                    escapeHtml={false}
                    renderers={{
                        code: BriefingSyntaxHighlighter,
                        image: BriefingImage,
                        table: BriefingTable,
                        tableCell: BriefingTableCell,
                        link: BriefingLink,
                        listItem: BriefingListItem,
                    }}
                />
            </Suspense>
        </div>
    )
}
