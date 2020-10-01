import React, { ReactElement, ReactNode, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { TableCell } from '@material-ui/core';

interface Props {
    children: ReactNode;
}

export default function DropdownMenu(
    {
        children
    }: Props
): ReactElement {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <>
            <button
                className='more-dropdown'
                onClick={openMenu}
            >
                <FontAwesomeIcon icon={faEllipsisV}/>
            </button>

            <Menu
                id='table-menu'
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={!!anchorEl}
                onClose={handleClose}
            >
                {
                    children
                }
            </Menu>
        </>
    )
}
