import React from 'react';
import Navigation from "./Navigation";
import { SnackbarProvider } from "notistack";
import { useAuth } from './helpers/auth';
import { SchoolIdContext } from './helpers/school';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from '@reduxjs/toolkit';
import runnerReducer from './stores/runner';
import uploaderReducer from './stores/uploader';

const applicationStore = createStore(combineReducers({
    runner: runnerReducer,
    uploader: uploaderReducer,
}));

function App() {
    const [,, user] = useAuth();

    return (
        <SnackbarProvider maxSnack={1}>
            <SchoolIdContext.Provider
                value={user?.schoolId}
            >
                <Provider store={applicationStore}>
                    <Navigation/>
                </Provider>
            </SchoolIdContext.Provider>
        </SnackbarProvider>
    );
}

export default App;
