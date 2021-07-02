import React, {createContext, useState} from "react";

export const AppContext = createContext(undefined);
export const AppDispatchContext = createContext(undefined);
export const AppProvider = ({children}) => {
    const [app_conf, setAppConf] = useState({
        sidebar_open: false,
    });

    return (
        <AppContext.Provider value={app_conf}>
            <AppDispatchContext.Provider value={{
                setAppConf
            }}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
}