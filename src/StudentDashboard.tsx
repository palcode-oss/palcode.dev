import React, { ReactElement } from "react";
import { User } from './helpers/types';

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user
    }: Props
): ReactElement {
    return (
        <div className='student dashboard'>

        </div>
    )
}
