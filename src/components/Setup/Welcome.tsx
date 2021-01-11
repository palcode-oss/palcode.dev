import styles from '../../styles/info.module.scss';
import form from '../../styles/form.module.scss';
import React from 'react';
import { SetupProps } from '../../pages/Setup';

export default function Welcome(
    {
        onNext
    }: SetupProps,
) {
    return <>
        <h1 className={styles.header}>
            Thanks for choosing PalCode!
        </h1>

        <p>
            You clearly have a great taste in online IDEs.
        </p>
        <p>
            Your account has now been created — we've just got a few quick things to set up, including authentication
            and billing.
        </p>
        <p>
            Please don't close this page during the setup process. If you need to continue setup later, make sure to
            save this page's full URL.
        </p>
        <p>
            Finally, if you need any help, feel free to email contact@palcode.dev.
        </p>

        <button
            className={form.button}
            onClick={onNext}
        >
            Let's go!
        </button>
    </>
}
