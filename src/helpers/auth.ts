import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { User, UserDoc } from './types';

export function useUser(userId?: string): [User | null, boolean] {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .get()
            .then((doc) => {
                setLoading(false);
                setUser({
                    ...doc.data() as UserDoc,
                    uid: doc.id,
                });
            });
    }, [userId]);

    return [user, loading];
}

export function useUserByUsername(username?: string): [User | null, boolean] {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        setLoading(true);
        firebase.firestore()
            .collection('users')
            .where('username', '==', username)
            .get()
            .then(response => {
                setLoading(false);

                if (!response.empty) {
                    setUser({
                        ...response.docs[0].data() as UserDoc,
                        uid: response.docs[0].id,
                    });
                }
            });
    }, [username]);

    return [user, loading];
}

export function useAuth(): [firebase.User | null, boolean, User | null] {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userDoc, setUserDoc] = useState<User | null>(null);

    useEffect(() => {
        return firebase
            .auth()
            .onAuthStateChanged(authUser => {
                if (authUser) {
                    setUser(authUser);
                    firebase
                        .firestore()
                        .collection('users')
                        .doc(authUser.uid)
                        .get()
                        .then((doc) => {
                            setUserDoc({
                                ...doc.data() as UserDoc,
                                uid: doc.id,
                            });
                            setLoading(false);
                        });
                } else {
                    setUser(null);
                    setUserDoc(null);
                    setLoading(false);
                }
            });
    }, []);

    return [user, loading, userDoc];
}
