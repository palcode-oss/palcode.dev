import React, { ReactElement } from "react";
import { User } from './helpers/types';

interface Props {
    user: User
}

export default function TeacherDashboard(
    {
        user
    }: Props
): ReactElement {
    return (
        <div className='teacher dashboard'>

        </div>
    )
}
