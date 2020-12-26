import React, { useContext } from 'react';
import { School, SchoolAuth } from '../types';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const SchoolIdContext = React.createContext<string | undefined>(undefined);

export function useSchoolId(): string | undefined {
    return useContext(SchoolIdContext);
}

export async function getSchoolAuth(schoolDomain?: string): Promise<SchoolAuth | undefined> {
    if (!schoolDomain) return;

    const schoolResponse = await firebase.firestore()
        .collection('schools')
        .where('auth.domains', 'array-contains', schoolDomain)
        .get();

    const school = schoolResponse.docs[0]?.data() as School | undefined;
    if (!school) {
        return;
    }

    return school.auth;
}
