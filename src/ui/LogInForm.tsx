import React, { ReactElement, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Perms, UserDoc } from '../helpers/types';
import form from '../styles/form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';

const provider = new firebase.auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({
    // the mgs.org tenant ID
    // https://www.whatismytenantid.com/
    //
    // see https://firebase.google.com/docs/auth/web/microsoft-oauth for details on how to use
    tenant: '391f633c-b9ba-4cd1-b446-168fe408c462',
});

interface Props {
    callback: () => void;
}

interface MicrosoftProfile {
    givenName?: string;
    surname?: string;
}

export default function LogInForm(
    {
        callback,
    }: Props,
): ReactElement {
    const {enqueueSnackbar} = useSnackbar();
    const msalLogin = useCallback(async () => {
        const userCredential = await firebase.auth()
            .signInWithPopup(provider)
            .catch(() => {
                enqueueSnackbar('We couldn\'t sign you in. Please ensure popups are enabled, and try again.', {
                    variant: 'warning',
                });

                return null;
            });

        if (!userCredential || !userCredential.user) return;

        if (!userCredential.user.email?.endsWith('mgs.org')) {
            enqueueSnackbar('Sorry, PalCode is only available for users with @mgs.org email addresses.', {
                variant: 'error',
            });
            return;
        }

        const existingUserResponse = await firebase.firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .get();

        let givenName = userCredential.user.displayName;
        if (!existingUserResponse.exists) {
            // for students, displayName is always their MGS username. not a nice, real name.
            // we default to displayName, but the additionalUserInfo object almost always contains the user's actual name
            let displayName = userCredential.user.displayName;

            if (userCredential.additionalUserInfo?.profile) {
                const profile = userCredential.additionalUserInfo.profile as MicrosoftProfile;
                if (profile.givenName && profile.surname) {
                    displayName = profile.givenName + ' ' + profile.surname;
                    givenName = profile.givenName;
                }
            }

            await firebase.firestore()
                .collection('users')
                .doc(userCredential.user.uid)
                .set({
                    email: userCredential.user.email,
                    displayName,
                    perms: Perms.Student,
                } as UserDoc);
        }

        enqueueSnackbar(`Hi ${givenName}! Signed in successfully.`, {
            variant: 'success',
        });
        callback();
    }, []);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className={form.form}
        >
            <button
                onClick={msalLogin}
                className={form.button}
            >
                <FontAwesomeIcon icon={faMicrosoft} />
                Sign in with MGS
            </button>
        </form>
    );
}
