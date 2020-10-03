import React, { ReactElement, ReactNode, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import Menu from '@material-ui/core/Menu';
import table from '../styles/table.module.scss';

interface Props {
    children: ReactNode;
}

export default function DropdownMenu(
    {
        children,
    }: Props,
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
                className={table.dropdownButton}
                onClick={openMenu}
            >
                <FontAwesomeIcon icon={faEllipsisV}/>
            </button>

            <Menu
                className={table.tableMenu}
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
    );
}
