import { SetupProps } from '../../pages/Setup';
import styles from '../../styles/info.module.scss';
import form from '../../styles/form.module.scss';
import React, { useCallback, useState } from 'react';
import { SchoolAuthService } from '../../types';
import axios from 'axios';
import getEnvVariable from '../../helpers/getEnv';
import { useSnackbar } from 'notistack';

export default function Authentication(
    {
        onNext,
        school,
        setupToken,
    }: SetupProps
) {
    const [service, setService] = useState<SchoolAuthService>('microsoft.com');
    const [tenant, setTenant] = useState('');

    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const save = useCallback(async () => {
        setLoading(true);
        let submissionTenant = tenant;
        if (service !== 'microsoft.com') {
            submissionTenant = school.auth.domains[0];
        }

        try {
            await axios.patch(
                getEnvVariable('API') + `/schools/${school.id}/auth`,
                {
                    authService: service,
                    tenant: submissionTenant,
                    setupToken,
                }
            );
        } catch (e) {
            setLoading(false);
            enqueueSnackbar('Something went wrong! Please check you\'ve entered everything correctly.', {
                variant: 'error',
            });
            return;
        }

        onNext();
    }, [school, onNext, service, tenant, setupToken]);

    return <form
        className={`${form.form} ${form.setup}`}
        onSubmit={() => {}}
    >
        <h1 className={styles.header}>
            Authentication
        </h1>
        <p>
            Let's work out how {school.name}'s students and staff will sign into PalCode.
        </p>

        <p>
            In case you're unfamiliar, OAuth is a protocol that lets applications like PalCode use services like
            Microsoft and Google to provide authentication for users.
        </p>
        <p>
            With PalCode, students enter your school's domain on the sign-in page, and they're automatically taken
            to the relevant OAuth service. For example, let's say your school uses G Suite for Education. A student
            would enter <strong>{school.auth.domains[0]}</strong> on the sign-in page, and they'd be taken to Google
            to enter their credentials. PalCode will then attempt to find the user based on the email address returned
            by Google, and we'll create it if it doesn't exist, with student permissions assigned by default.
        </p>

        <h2>
            OAuth service
        </h2>
        <p>
            Which service does your school use?
        </p>
        <input
            type='radio'
            name='service'
            id='microsoft'
            value='microsoft.com'
            checked={service === 'microsoft.com'}
            onChange={() => setService('microsoft.com')}
        />
        <label
            htmlFor='microsoft'
        >
            Microsoft/Azure AD
        </label><br/>
        <input
            type='radio'
            name='service'
            id='google'
            value='google.com'
            checked={service === 'google.com'}
            onChange={() => setService('google.com')}
        />
        <label
            htmlFor='google'
        >
            G Suite for Education (or any other Google Workspace edition)
        </label>

        {service === 'microsoft.com' && <>
            <h2>
                Tenant ID
            </h2>
            <p>
                This is what we use to take users to the correct Microsoft login page. Only users belonging to this
                tenant will be allowed to sign into your school, regardless of their email domain.
            </p>
            <p>
                If you know your tenant ID, please paste it in the field. In the likely case that you don't,
                please visit&nbsp;
                <a
                    href='https://whatismytenantid.com'
                    target='_blank'
                    rel='noreferrer noopener'
                    title='Opens in a new tab'
                >
                    this helpful website
                </a>
                &nbsp;to find out.
            </p>

            <label
                htmlFor='tenantId'
                className={form.label}
            >
                Azure Tenant ID
            </label>
            <input
                type='text'
                className={form.textInput}
                id='tenantId'
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
            />
        </>}
        {service === "google.com" && <>
            <p>
                Great! We'll only allow users with your specified domain(s) to sign in via Google.
            </p>
            <p>
                That domain is currently {school.auth.domains[0]}, but you can add more later.
            </p>
        </>}

        <button
            type='button'
            className={form.button}
            onClick={save}
            disabled={loading}
        >
            {loading && 'Saving...'}
            {!loading && 'Save & continue'}
        </button>
    </form>
}
