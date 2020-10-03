import React, { ReactElement } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Dashboard from './Dashboard';
import NewTask from './NewTask';
import Task from './Task';
import Navbar from './ui/Navbar';
import CodePage from './CodePage';
import ManageClassroom from './ManageClassroom';
import ViewClassroom from './ViewClassroom';
import JoinClassroom from './JoinClassroom';
import { useAuth } from './helpers/auth';
import { Perms } from './helpers/types';

const history = createBrowserHistory();

export function RedirectUnauthed(
    {
        onlyTeachers
    }: {onlyTeachers?: Boolean}
): ReactElement {
    const [userObj, loading, user] = useAuth();

    if (onlyTeachers) {
        if ((!loading && !userObj) || (user && user.perms === Perms.Student)) {
            return (
                <Redirect to='/' />
            )
        }
    } else {
        if (!loading && !userObj) {
            return (
                <Redirect to='/' />
            );
        }
    }

    return <></>;
}

export default function Navigation(): ReactElement {
    const [userObj, loading, user] = useAuth();

    return (
        <Router history={history}>
            <Navbar />

            <Switch>
                <Route path='/classroom/join'>
                    <RedirectUnauthed />
                    <JoinClassroom />
                </Route>
                <Route path='/classroom/:classroomId/view_code'>
                    <RedirectUnauthed onlyTeachers />
                    <CodePage />
                </Route>
                <Route path='/classroom/:classroomId/manage'>
                    <RedirectUnauthed onlyTeachers />
                    <ManageClassroom />
                </Route>
                <Route path='/classroom/:classroomId/view'>
                    <RedirectUnauthed />
                    <ViewClassroom />
                </Route>
                <Route path='/task/new'>
                    <RedirectUnauthed onlyTeachers />
                    <NewTask />
                </Route>
                <Route path='/task/:taskId'>
                    <RedirectUnauthed />
                    <Task />
                </Route>
                <Route path='/'>
                    <Dashboard />
                </Route>
            </Switch>
        </Router>
    )
}
