import React, { useContext } from 'react';

export const SchoolIdContext = React.createContext<string | undefined>(undefined);

export function useSchoolId(): string | undefined {
    return useContext(SchoolIdContext);
}
