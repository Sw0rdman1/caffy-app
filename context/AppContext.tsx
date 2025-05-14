import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
    imageUri: string | null;
    setImageUri: (uri: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);



    return (
        <AppContext.Provider value={{ imageUri, setImageUri }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
