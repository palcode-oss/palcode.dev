import getEnvVariable from './getEnv';
import * as Stripe from '@stripe/stripe-js';

let stripe: Promise<Stripe.Stripe | null>;

const stripeToken = getEnvVariable('STRIPE');
if (!stripeToken) {
    console.warn("Stripe token not found! Billing-related features won't work.");
} else {
    stripe = Stripe.loadStripe(stripeToken);
}

export default function getStripe(): Promise<Stripe.Stripe | null> {
    if (stripe) {
        return stripe;
    } else {
        throw new Error("Stripe not initialised");
    }
}
