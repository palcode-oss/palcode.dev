import React, { FunctionComponent, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import styles from '../styles/info.module.scss';
import LazyComponentFallback from '../ui/LazyComponentFallback';
import { School } from '../types';
import Spinner from '../ui/Spinner';

enum Step {
    Welcome,
    Authentication,
    Billing,
    Plan,
}

export interface SetupProps {
    onNext(): void;
    school: School;
    setupToken: string;
}

export default function Setup() {
    const [school, setSchool] = useState<School | undefined>();
    const [setupToken, setSetupToken] = useState<string | undefined>();
    const [loadError, setLoadError] = useState<string | undefined>();
    useEffect(() => {
        firebase.auth().signOut()
            .finally(() => {});

        (async () => {
            const params = new URLSearchParams(window.location.search);
            const schoolId = params.get('schoolId');
            const setupTokenParam = params.get('setupToken');
            if (!schoolId || !setupTokenParam) {
                setLoadError("No school ID found. Please get in touch with contact@palcode.dev.");
                return;
            }

            setSetupToken(setupTokenParam);

            const schoolResponse = await firebase.firestore()
                .collection('schools')
                .doc(schoolId)
                .get();

            const school = schoolResponse.data() as School | undefined;
            if (!school) {
                setLoadError("School not found. Please get in touch with contact@palcode.dev.");
                return;
            }

            setSchool({
                ...school,
                id: schoolResponse.id,
            });
        })();
    }, []);

    const [step, setStep] = useState(Step.Welcome);
    const StepComponent = useMemo<React.LazyExoticComponent<FunctionComponent<SetupProps>>>(() => {
        return [
            lazy(() => import('../components/Setup/Welcome')),
            lazy(() => import('../components/Setup/Authentication')),
            lazy(() => import('../components/Setup/Billing')),
            lazy(() => import('../components/Setup/Plan')),
        ][step];
    }, [step]);

    const next = () => {
        if (step !== Step.Plan) {
            setStep(step + 1);
        }
    };

    return <div className={styles.textContainer}>
        {!school && !loadError && (
            <Spinner />
        )}

        {loadError && <p>
            {loadError}
        </p>}

        {!loadError && school && setupToken && <Suspense fallback={<LazyComponentFallback />}>
            <StepComponent
                onNext={next}
                school={school}
                setupToken={setupToken}
            />
        </Suspense>}
    </div>
}
