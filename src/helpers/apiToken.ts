import { useEffect, useState } from 'react';
import { useAuth } from './auth';

export default function useAPIToken(): string | undefined {
    const [token, setToken] = useState<undefined | string>();
    const [user] = useAuth(false);

    useEffect(() => {
        (async () => {
            if (!user) return;

            let tokenResponse = '';
            try {
                tokenResponse = await user.getIdToken();
            } catch (e) {}

            if (!tokenResponse) return;

            setToken(tokenResponse);
        })();
    }, [user]);

    return token;
}
