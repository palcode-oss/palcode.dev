import React from 'react';
import Navigation from "./Navigation";
import { SnackbarProvider } from "notistack";
import { useAuth } from './helpers/auth';
import { SchoolIdContext } from './helpers/school';

function App() {
    const [,, user] = useAuth();

    return (
        <SnackbarProvider maxSnack={1}>
            <SchoolIdContext.Provider
                value={user?.schoolId}
            >
                <Navigation/>
            </SchoolIdContext.Provider>
        </SnackbarProvider>
    );
}

export default App;
