import React, { useState } from 'react';
import { usePrivateTasks } from '../helpers/taskData';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import moment from 'moment';
import privateTasks from '../styles/privateTasks.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import NewTaskModal from './NewTaskModal';
import { useHistory } from 'react-router-dom';
import table from '../styles/table.module.scss';
import form from '../styles/form.module.scss';
import Spinner from '../ui/Spinner';
import TaskLanguageIcon from '../ui/TaskLanguageIcon';

export default function PrivateTasks() {
    const [tasks, loading] = usePrivateTasks();

    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    return <>
        <div className={privateTasks.header}>
            <button
                className={form.button}
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon icon={faPlus} />
                New project
            </button>
        </div>

        {showModal && (
            <NewTaskModal
                privateTask={true}
                closeModal={() => setShowModal(false)}
            />
        )}

        {!loading && tasks.length === 0 && (
            <p>
                You haven't created any private projects yet.
            </p>
        )}

        {loading && (
            <Spinner />
        )}

        <TableContainer>
            <Table>
                <TableBody>
                    {tasks.map(task => (
                        <TableRow
                            key={task.id}
                            onClick={() => history.push(
                                `/task/${task.id}`,
                            )}
                            className={table.link}
                        >
                            <TableCell>
                                <TaskLanguageIcon language={task.language} />
                                {task.name}
                            </TableCell>

                            <TableCell>
                                {moment(task.created.toDate()).fromNow()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}
