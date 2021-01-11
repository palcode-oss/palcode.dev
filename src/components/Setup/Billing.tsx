import { SetupProps } from '../../pages/Setup';
import styles from '../../styles/info.module.scss';
import form from '../../styles/form.module.scss';
import { useCallback, useState } from 'react';
import getStripe from '../../helpers/stripe';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import getEnvVariable from '../../helpers/getEnv';
import TextInput from './TextInput';
import { FieldValues, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const stripe = getStripe();

const BillingPrimitive = (
    {
        setupToken,
        school,
        onNext,
    }: SetupProps
) => {
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<undefined | string>();

    const {enqueueSnackbar} = useSnackbar();
    const {register, handleSubmit, errors} = useForm();
    const getSetupIntent = useCallback(async (data: FieldValues) => {
        setLoading(true);

        let newClientSecret: string;
        try {
            const response = await axios.post(
                getEnvVariable('API') + `/schools/${school.id}/billing/setup`,
                {
                    setupToken,
                    schoolId: school.id,
                    ...data,
                }
            );
            newClientSecret = response.data;
        } catch (e) {
            enqueueSnackbar('We couldn\'t save that! Please check your inputs and try again.', {
                variant: 'error',
            });
            setLoading(false);
            return;
        }

        setLoading(false);
        setClientSecret(newClientSecret);
    }, [school, setupToken]);

    const elements = useElements();
    const stripeHook = useStripe();
    const confirmSetupIntent = useCallback(async () => {
        if (!elements || !stripeHook || !clientSecret) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            return;
        }

        setLoading(true);
        const {error, paymentMethod} = await stripeHook.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            enqueueSnackbar(error.message, {
                variant: 'error',
            });
            setLoading(false);
            return;
        }

        if (!paymentMethod) return;

        const {error: confirmError} = await stripeHook.confirmCardSetup(clientSecret, {
            payment_method: paymentMethod.id,
        });
        setLoading(false);

        if (confirmError) {
            enqueueSnackbar(confirmError.message, {
                variant: 'warning',
            });
        } else {
            enqueueSnackbar('Card saved successfully!', {
                variant: 'success',
            });
            onNext();
        }
    }, [clientSecret, elements, stripeHook, onNext]);

    return <>
        <h1 className={styles.header}>
            Billing
        </h1>

        <h2>
            Invoice details
        </h2>
        {!clientSecret ? <>
            <p>
                Firstly, we need your billing details. You can change these at any time.
            </p>
            <form
                onSubmit={handleSubmit(getSetupIntent)}
                className={`${form.form} ${form.setup}`}
            >
                <TextInput
                    id='billingName'
                    label='Full name'
                    hookRef={register({
                        required: true,
                    })}
                    errors={errors}
                />
                <TextInput
                    id='billingEmail'
                    label='Email address'
                    hookRef={register({
                        required: true,
                        pattern: /^\S+@\S+$/,
                    })}
                    errors={errors}
                />
                <TextInput
                    id='billingLine1'
                    label='Address Line 1'
                    hookRef={register({
                        required: true,
                        minLength: 3,
                    })}
                    errors={errors}
                />
                <TextInput
                    id='billingPostalCode'
                    label='Postcode'
                    hookRef={register({
                        required: true,
                        pattern: /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/,
                    })}
                    errors={errors}
                />

                <p>
                    Not in the UK? Please email contact@palcode.dev for a personalised setup.
                </p>

                <button
                    type='submit'
                    className={form.button}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Continue'}
                </button>
            </form>
        </> : <p>
            Invoice details saved!&nbsp;
            <a
                href='#'
                onClick={() => setClientSecret('')}
            >
                Edit.
            </a>
        </p>}

        {clientSecret && <>
            <h2>
                Payment method
            </h2>
            <p>
                PalCode uses Stripe to bill you for recurring subscriptions. You can use any debit/credit card, and you'll
                get billed automatically.
            </p>
            <p>
                If you need something different (e.g. an invoice or Direct Debit), please email contact@palcode.dev.
            </p>

            <h2>
                Pay with card
            </h2>
            <p>
                You won't be charged or subscribed to anything. We'll choose a plan in the next step.
            </p>
            <div className={form.payment}>
                <CardElement />
            </div>

            <button
                className={form.button}
                onClick={confirmSetupIntent}
                disabled={!stripeHook || loading}
            >
                Save card
            </button>
        </>}
    </>
}

export default function Billing(props: SetupProps) {
    return <Elements stripe={stripe}>
        <BillingPrimitive {...props} />
    </Elements>
}
