import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch, useParams } from 'react-router-dom';
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
import firebase from 'firebase/app';
import { useSnackbar } from 'notistack';

const history = createBrowserHistory();

function RedirectUnauthed(
    {
        onlyTeachers,
    }: { onlyTeachers?: boolean },
): ReactElement {
    const [userObj, loading, user] = useAuth();

    if (onlyTeachers) {
        if ((!loading && !userObj) || (user && user.perms === Perms.Student)) {
            return (
                <Redirect to='/'/>
            );
        }
    } else {
        if (!loading && !userObj) {
            return (
                <Redirect to='/'/>
            );
        }
    }

    return <></>;
}

interface ClassroomParams {
    classroomId: string;
}

function EnsureClassroomExists(): ReactElement {
    const {classroomId} = useParams<ClassroomParams>();
    const [classroomError, setClassroomError] = useState(false);

    const {enqueueSnackbar} = useSnackbar();
    const handleError = useCallback(() => {
        enqueueSnackbar('We couldn\'t find that classroom - check your URL and try again.', {
            variant: 'warning',
        });
        setClassroomError(true);
    }, []);

    useEffect(() => {
        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroomId)
            .get()
            .then((d) => {
                if (!d.exists) handleError();
            })
            .catch(handleError);
    }, [classroomId]);

    if (classroomError) {
        return (
            <Redirect to='/'/>
        );
    }

    return <></>;
}

interface TaskParams {
    taskId: string;
}

function EnsureTaskExists(): ReactElement {
    const {taskId} = useParams<TaskParams>();
    const [taskError, setTaskError] = useState(false);

    const {enqueueSnackbar} = useSnackbar();
    const handleError = useCallback(() => {
        enqueueSnackbar('We couldn\'t find that task - check your URL and try again.', {
            variant: 'warning',
        });
        setTaskError(true);
    }, []);

    useEffect(() => {
        firebase
            .firestore()
            .collection('tasks')
            .doc(taskId)
            .get()
            .then((d) => {
                if (!d.exists) handleError();
            })
            .catch(handleError);
    }, [taskId]);

    if (taskError) {
        return (
            <Redirect to='/'/>
        );
    }

    return <></>;
}


export default function Navigation(): ReactElement {
    return (
        <Router history={history}>
            <Navbar/>

            <Switch>
                <Route path='/classroom/join'>
                    <RedirectUnauthed/>
                    <JoinClassroom/>
                </Route>
                <Route path='/classroom/:classroomId/view_code'>
                    <RedirectUnauthed onlyTeachers/>
                    <EnsureClassroomExists/>
                    <CodePage/>
                </Route>
                <Route path='/classroom/:classroomId/manage'>
                    <RedirectUnauthed onlyTeachers/>
                    <EnsureClassroomExists/>
                    <ManageClassroom/>
                </Route>
                <Route path='/classroom/:classroomId/view'>
                    <RedirectUnauthed/>
                    <EnsureClassroomExists/>
                    <ViewClassroom/>
                </Route>
                <Route path='/task/new'>
                    <RedirectUnauthed onlyTeachers/>
                    <NewTask/>
                </Route>
                <Route path='/task/:taskId'>
                    <RedirectUnauthed/>
                    <EnsureTaskExists/>
                    <Task/>
                </Route>
                <Route path='/'>
                    <Dashboard/>
                </Route>
            </Switch>
        </Router>
    );
}
