import React from 'react';
import firebase from 'firebase';
import Navigation from "./Navigation";
import { SnackbarProvider } from "notistack";

firebase.initializeApp({
    apiKey: "AIzaSyDvtCpVfSv_WyqODPmPlrYvGqCmlZZlbk8",
    authDomain: "palcode-ba70e.firebaseapp.com",
    databaseURL: "https://palcode-ba70e.firebaseio.com",
    projectId: "palcode-ba70e",
    storageBucket: "palcode-ba70e.appspot.com",
    messagingSenderId: "1066769258920",
    appId: "1:1066769258920:web:472b48d2d97f99f99fa59d",
});

function App() {
    return (
        <SnackbarProvider maxSnack={1}>
            <Navigation/>
        </SnackbarProvider>
    );
}

export default App;
