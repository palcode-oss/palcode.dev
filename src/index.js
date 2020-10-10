import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/reset.scss';
import firebase from "firebase/app";

firebase.initializeApp({
    apiKey: process.env.REACT_APP_F_API_KEY,
    authDomain: process.env.REACT_APP_F_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_F_DATABASE_URL,
    projectId: process.env.REACT_APP_F_PROJECT_ID,
    storageBucket: process.env.REACT_APP_F_STORAGE_BUCKET,
    appId: process.env.REACT_APP_F_APP_ID,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
