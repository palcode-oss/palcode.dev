import firebase from 'firebase';
import 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuth(): [firebase.User | null, boolean] {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(authUser => {
            setLoading(false);
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    return [user, loading];
}
