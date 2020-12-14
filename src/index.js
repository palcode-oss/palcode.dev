import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/reset.scss';
import firebase from "firebase/app";
import getEnvVariable from "./helpers/getEnv";

firebase.initializeApp({
    apiKey: getEnvVariable('F_API_KEY'),
    authDomain: getEnvVariable('F_AUTH_DOMAIN'),
    databaseURL: getEnvVariable('F_DATABASE_URL'),
    projectId: getEnvVariable('F_PROJECT_ID'),
    storageBucket: getEnvVariable('F_STORAGE_BUCKET'),
    appId: getEnvVariable('F_APP_ID'),
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
