import React, { ReactElement } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Dashboard from "./Dashboard";
import NewTask from "./NewTask";
import Task from "./Task";
import Navbar from "./ui/Navbar";
import Settings from "./Settings";

const history = createBrowserHistory();

export default function Navigation(): ReactElement {
    return (
        <Router history={history}>
            <Navbar />

            <Switch>
                <Route path='/'>
                    <Dashboard />
                </Route>
                <Route path='/user/settings'>
                    <Settings />
                </Route>
                <Route path='/task/new'>
                    <NewTask />
                </Route>
                <Route path='/task/:taskId'>
                    <Task />
                </Route>
            </Switch>
        </Router>
    )
}
