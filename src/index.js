import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/reset.scss';
import firebase from "firebase/app";

firebase.initializeApp({
    apiKey: "AIzaSyDvtCpVfSv_WyqODPmPlrYvGqCmlZZlbk8",
    authDomain: "palcode-ba70e.firebaseapp.com",
    databaseURL: "https://palcode-ba70e.firebaseio.com",
    projectId: "palcode-ba70e",
    storageBucket: "palcode-ba70e.appspot.com",
    appId: "1:1066769258920:web:472b48d2d97f99f99fa59d",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
