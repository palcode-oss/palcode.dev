import { SetupProps } from '../../pages/Setup';
import form from '../../styles/form.module.scss';
import styles from '../../styles/info.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import getEnvVariable from '../../helpers/getEnv';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

export default function Plan(
    {
        setupToken,
        school,
    }: SetupProps,
) {
    const [plan, setPlan] = useState('starter');
    const [frequency, setFrequency] = useState('yearly');

    const [price, setPrice] = useState<undefined | number>();
    const [planId, setPlanId] = useState<undefined | string>();
    useEffect(() => {
        setPlanId(undefined);
        setPrice(undefined);

        axios.get(
            getEnvVariable('API') + `/plans/${plan}/${frequency}`,
        )
            .then(response => {
                setPlanId(response.data.id);
                setPrice(response.data.amount);
            })
            .catch(() => {});
    }, [plan, frequency]);

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const createSubscription = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!planId) {
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                getEnvVariable('API') + `/schools/${school.id}/billing/subscribe`,
                {
                    setupToken,
                    planId,
                }
            );
        } catch (e) {
            enqueueSnackbar('Oh no! We couldn\'t create your subscription. Your card won\'t be charged.', {
                variant: 'warning',
            });
            setLoading(false);
            return;
        }

        enqueueSnackbar('That\'s it! Please login now to complete your setup process.', {
            variant: 'success',
        });

        localStorage.setItem("setupToken", setupToken);
        history.push('/');
    }, [school, setupToken, planId]);

    return <>
        <h1 className={styles.header}>
            Choose a plan
        </h1>

        <p>
            You're now just one step away from coding glory.
        </p>
        <p>
            To see details about our plans (including their current price), please visit our&nbsp;
            <a
                href='https://palcode.dev/pricing'
                rel='noreferrer noopener'
                target='_blank'
                title='Opens in a new tab'
            >
                Pricing page.
            </a>
        </p>

        <form
            className={`${form.form} ${form.setup}`}
            onSubmit={createSubscription}
        >
            <label
                htmlFor='plan'
                className={form.label}
            >
                Plan
            </label>
            <select
                className={form.select}
                id='plan'
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
            >
                <option value='free'>
                    Free
                </option>
                <option value='starter'>
                    Starter
                </option>
                <option value='standard'>
                    Standard
                </option>
                <option value='mega'>
                    Mega
                </option>
            </select>

            <p>
                We recommend paying yearly — this gets you 10% off overall, and makes our finances
                more reliable as a small business. It's truly win-win.
            </p>
            <label
                htmlFor='Frequency'
                className={form.label}
            >
                Frequency (payment term)
            </label>
            <select
                className={form.select}
                id='frequency'
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
            >
                <option value='monthly'>
                    Monthly
                </option>
                <option value='yearly'>
                    Yearly
                </option>
            </select>

            <p>
                Total:&nbsp;
                {price !== undefined ? <strong>
                    £{price}/{frequency === 'monthly' ? 'month' : 'year'}
                </strong> : <span>
                    loading...
                </span>}
            </p>

            <button
                className={form.button}
                type='submit'
                disabled={price === undefined || loading}
            >
                {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
        </form>
    </>
}
