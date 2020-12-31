import React from 'react';
import Navigation from "./Navigation";
import { SnackbarProvider } from "notistack";
import { useAuth } from './helpers/auth';
import { SchoolIdContext } from './helpers/school';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from '@reduxjs/toolkit';
import runnerReducer from './stores/runner';
import uploaderReducer from './stores/uploader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const applicationStore = createStore(combineReducers({
    runner: runnerReducer,
    uploader: uploaderReducer,
}));

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Lato, sans-serif',
        fontSize: 15,
    },
    overrides: {
        MuiTableContainer: {
            'root': {
                borderRadius: 15,
            }
        }
    }
});

function App() {
    const [,, user] = useAuth();

    return <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
            <SchoolIdContext.Provider
                value={user?.schoolId}
            >
                <Provider store={applicationStore}>
                    <Navigation/>
                </Provider>
            </SchoolIdContext.Provider>
        </SnackbarProvider>
    </MuiThemeProvider>;
}

export default App;
