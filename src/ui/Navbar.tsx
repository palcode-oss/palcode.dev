import React, { ReactElement } from "react";
import { useAuth } from "../helpers/auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import { Shimmer } from "react-shimmer";

export default function Navbar(): ReactElement {
    const [authUser, authLoading] = useAuth();

    return (
        <div className='navbar'>
            <h1 className='title'>
                <Link to='/'>
                    PalCode
                </Link>
            </h1>

            <div className='nav-options'>
                {
                    authUser && (
                        <>
                            <Link
                                className='option'
                                to='/'
                            >
                                <FontAwesomeIcon icon={faHome}/>
                                &nbsp;Dashboard
                            </Link>
                            <Link
                                className='option'
                                to='/user/settings'
                            >
                                <FontAwesomeIcon icon={faCog}/>
                                &nbsp;Settings
                            </Link>
                            <button className='option sign-out'>
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                                &nbsp;Sign out
                            </button>
                        </>
                    )
                }

                {
                    !authLoading && !authUser && (
                        <button className='option'>
                            <FontAwesomeIcon icon={faSignInAlt}/>
                            &nbsp;Sign in
                        </button>
                    )
                }

                {
                    authLoading && (
                        <button className='option loading'>
                            <Shimmer
                                height={12}
                                width={100}
                                className='shimmer'
                            />
                        </button>
                    )
                }
            </div>
        </div>
    )
}
