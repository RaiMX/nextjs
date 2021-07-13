import React, {createContext, useState} from "react";
import {useRouter} from "next/router";
import {useCookies} from 'react-cookie';
import {parseUserStorage} from "../utils/auth";

export const AppContext = createContext(undefined);
export const AppDispatchContext = createContext(undefined);
export const AppProvider = ({children}) => {
    const router = useRouter();
    const [cookie, setCookie] = useCookies(['NEXT_LOCALE']);

    const locale = cookie.NEXT_LOCALE || 'ru';

    const [app_conf, setAppConf] = useState({
        locale: locale,
        route_name: 'Главная',
        sidebar_open: false,
        toolbar_show: true,
        toolbar_tools: {},
    });

    const [user_info, setUserInfo] = useState({
        user: null,
    });

    React.useEffect(() => {

        const user_storage = parseUserStorage();
        if (user_storage) {
            setUserInfo(old => ({
                ...old,
                user: user_storage
            }))
        }

        setCookie("NEXT_LOCALE", locale, {path: "/"});
        router.push(router.pathname, router.pathname, {locale});
    }, [])

    return (
        <AppContext.Provider value={{
            app_conf,
            user_info
        }}>
            <AppDispatchContext.Provider value={{
                setAppConf,
                setUserInfo
            }}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
}