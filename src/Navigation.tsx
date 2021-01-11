import React, { lazy, ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch, useParams } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Navbar from './components/Navbar';
import { useAuth } from './helpers/auth';
import { Perms } from './types';
import firebase from 'firebase/app';
import { useSnackbar } from 'notistack';
import LazyComponentFallback from './ui/LazyComponentFallback';
import Dashboard from './pages/Dashboard';

const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Task = lazy(() => import('./pages/Task'));
const ManageClassroom = lazy(() => import('./pages/ManageClassroom'));
const ViewClassroom = lazy(() => import('./pages/ViewClassroom'));
const ReviewTask = lazy(() => import('./pages/ReviewTask'));
const AddStudents = lazy(() => import('./pages/AddStudents'));
const Setup = lazy(() => import('./pages/Setup'));

const history = createBrowserHistory();

function RedirectUnauthed(
    {
        onlyTeachers,
    }: { onlyTeachers?: boolean },
): ReactElement {
    const [userObj, loading, user] = useAuth();

    const {enqueueSnackbar} = useSnackbar();
    if (onlyTeachers) {
        if ((!loading && !userObj) || (user && user.perms === Perms.Student)) {
            enqueueSnackbar('Oops - it appears that you\'re not allowed to access that page!', {
                variant: 'error',
            });
            return (
                <Redirect to='/'/>
            );
        }
    } else {
        if (!loading && !userObj) {
            enqueueSnackbar('Try logging in first, then accessing this page again.', {
                variant: 'warning',
            });
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
            <Navbar />

            <Suspense fallback={<LazyComponentFallback />}>
                <Switch>
                    <Route path='/classroom/:classroomId/manage'>
                        <RedirectUnauthed onlyTeachers />
                        <EnsureClassroomExists />
                        <ManageClassroom />
                    </Route>
                    <Route path='/classroom/:classroomId/view'>
                        <RedirectUnauthed />
                        <EnsureClassroomExists />
                        <ViewClassroom />
                    </Route>
                    <Route path='/classroom/:classroomId/add_students'>
                        <RedirectUnauthed onlyTeachers />
                        <EnsureClassroomExists />
                        <AddStudents />
                    </Route>
                    <Route path='/task/:taskId/review'>
                        <RedirectUnauthed onlyTeachers />
                        <EnsureTaskExists />
                        <ReviewTask />
                    </Route>
                    <Route path='/task/:taskId/feedback'>
                        <RedirectUnauthed onlyTeachers />
                        <EnsureTaskExists />
                        <Task teacherView />
                    </Route>
                    <Route path='/task/:taskId'>
                        <RedirectUnauthed />
                        <EnsureTaskExists />
                        <Task />
                    </Route>
                    <Route path='/help'>
                        <Help />
                    </Route>
                    <Route path='/privacy'>
                        <Privacy />
                    </Route>
                    <Route path='/setup'>
                        <Setup />
                    </Route>
                    <Route path='/'>
                        <Dashboard />
                    </Route>
                </Switch>
            </Suspense>
        </Router>
    );
}
