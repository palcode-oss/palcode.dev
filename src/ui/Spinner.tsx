import loader from '../styles/loader.module.scss';
import Loader from 'react-loader-spinner';
import React from 'react';

export default function Spinner() {
    return <div className={loader.loader}>
        <Loader
            type='Oval'
            width={120}
            height={120}
            color='blue'
        />
    </div>;
}
