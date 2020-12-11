import React, { ReactElement, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';

export default function LazyComponentFallback(): ReactElement {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    if (!showLoader) {
        return <></>;
    }

    return (
        <div
            style={{
                margin: 20,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Loader
                type='Oval'
                width={40}
                height={40}
                color='blue'
            />
        </div>
    );
}
