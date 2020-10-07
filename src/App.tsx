import React from 'react';
import Navigation from "./Navigation";
import { SnackbarProvider } from "notistack";

function App() {
    return (
        <SnackbarProvider maxSnack={1}>
            <Navigation/>
        </SnackbarProvider>
    );
}

export default App;
