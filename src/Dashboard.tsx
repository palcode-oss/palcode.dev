import React, { ReactElement } from "react";
import { useAuth } from './helpers/auth';

export default function Dashboard(): ReactElement {
    const [user, loading, userDoc] = useAuth();

    return (
        <div className='dashboard'>

        </div>
    )
}
