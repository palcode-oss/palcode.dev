import React, { useState } from 'react';
import { usePrivateTasks } from '../helpers/taskData';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import moment from 'moment';
import privateTasks from '../styles/privateTasks.module.scss';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import Tooltip from '@material-ui/core/Tooltip';
import NewTaskModal from './NewTaskModal';
import { useHistory } from 'react-router-dom';
import table from '../styles/table.module.scss';

export default function PrivateTasks() {
    const [tasks, loading] = usePrivateTasks();

    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    return <>
        <div className={privateTasks.header}>
            <h1>
                Private projects
            </h1>

            <Tooltip
                title='New private project'
                className={privateTasks.button}
            >
                <IconButton onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus}/>
                </IconButton>
            </Tooltip>
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
