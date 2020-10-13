import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import Menu from '@material-ui/core/Menu';
import table from '../styles/table.module.scss';

interface Props {
    children: ReactNode;
    open?: boolean;
    onChange?(opened: boolean): void;
}

export default function DropdownMenu(
    {
        children,
        open,
        onChange,
    }: Props,
): ReactElement {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);

        if (onChange) {
            onChange(true);
        }
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);

        if (onChange) {
            onChange(false);
        }
    }, []);

    useEffect(() => {
        if (open === false) {
            setAnchorEl(null);
        }
    }, [open]);

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
