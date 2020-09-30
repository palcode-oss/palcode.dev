import React, { ReactElement } from "react";
import { useAuth } from "../helpers/auth";

export default function Navbar(): ReactElement {
    const [authUser, authLoading] = useAuth();

    return (
        <div className='navbar'>

        </div>
    )
}
