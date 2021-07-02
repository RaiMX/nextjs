import React, {createContext, useState} from "react";
import {useRouter} from "next/router";
import {useCookies} from 'react-cookie';

export const AppContext = createContext(undefined);
export const AppDispatchContext = createContext(undefined);
export const AppProvider = ({children}) => {
    const router = useRouter();
    const [cookie, setCookie] = useCookies(['NEXT_LOCALE']);

    const locale = cookie.NEXT_LOCALE || 'ru';

    const [app_conf, setAppConf] = useState({
        locale: locale,
        sidebar_open: false,
        route_name: 'Главная',
    });

    React.useEffect(() => {
        setCookie("NEXT_LOCALE", locale, {path: "/"});
        router.push(router.pathname, router.pathname, {locale});
    }, [])

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