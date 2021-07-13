import Router from 'next/router';
import Cookies from 'js-cookie';
import api from "./axios";
import {STATIC_ROUTES} from "utils/CONSTANTS";
import {toast} from "react-toastify";

export const login = (credentials) => {
    return new Promise(((resolve, reject) => {
        api.post(`${process.env.LOGIN_URL}`, credentials)
            .then(response => {
                Cookies.set('tokens', response.data.tokens);
                Cookies.set('user', response.data.user);
                resolve(response.data);
            })
            .catch(error => {
                if (error.response === undefined) {
                    toast.error('Не удалось подключиться к серверу')
                } else if (error.response.status === 401) {
                    toast.error('Имя пользователя или пароль неправильны')
                } else if (error.response.status === 403) {
                    toast.error('Вход запрещён')
                    toast.error(error.response.data.message)
                } else if (error.response.status === 406) {
                    toast.error('Не введен логин или пароль')
                } else {
                    toast.error('Произошла ошибка, пожалуйста свяжитесь с администратором')
                }
                reject(error);
            })
    }))
}

export const logout = async () => {
    Cookies.remove('tokens', {path: '/'});
    await Router.push(STATIC_ROUTES.LOGIN)
}

export const forgotPassword = (email) => {
    return new Promise(((resolve, reject) => {
        api.post(`${process.env.FORGOT_PASS_URL}`, {email})
            .then(response => {
                Cookies.set('tokens', response.data.tokens);
                Cookies.set('user', response.data.user);
                resolve(response.data);
            })
            .catch(error => {
                if (error.response === undefined) {
                    toast.error('Не удалось подключиться к серверу')
                } else if (error.response.status === 401) {
                    toast.error('Имя пользователя или пароль неправильны')
                } else if (error.response.status === 403) {
                    toast.error('Вход запрещён')
                    toast.error(error.response.data.message)
                } else if (error.response.status === 406) {
                    toast.error('Не введен логин или пароль')
                } else {
                    toast.error('Произошла ошибка, пожалуйста свяжитесь с администратором')
                }
                reject(error);
            })
    }))
}

export const parseTokens = () => {
    const tokens_json = Cookies.get('tokens', {path: '/'});
    if (tokens_json && tokens_json !== 'undefined') {
        const tokens = JSON.parse(tokens_json);
        tokens.access.expires = new Date(tokens.access.expires);
        tokens.refresh.expires = new Date(tokens.refresh.expires);
        return tokens;
    }
    return null;
}

export const parseUserStorage = () => {
    const user_json = Cookies.get('user', {path: '/'});
    if (user_json && user_json !== 'undefined') {
        const user = JSON.parse(user_json);
        // user.access.expires = new Date(tokens.access.expires);
        return user;
    }
    return null;
}

export const refreshTokens = () => {
    const tokens = parseTokens();

    return new Promise(((resolve, reject) => {
        if (tokens) {
            api.post(`${process.env.REFRESH_TOKEN_URL}`, {refreshToken: tokens.refresh.token})
                .then(response => {
                    Cookies.set('tokens', response.data, {path: '/'});
                    resolve(response.data)
                })
                .catch(error => {
                    console.error('error refreshing tokens', error.response.data)
                    resolve(false)
                })
        } else {
            resolve(false)
        }
    }))
}

/**
 *
 * @returns {Promise<Boolean>}
 */
export const checkTokens = () => {
    return new Promise(((resolve, reject) => {
        const now = new Date();
        const tokens = parseTokens();
        if (!tokens) {
            Cookies.remove('user', {path: '/'});
            resolve(false);
        } else if (now > tokens.refresh.expires) {
            Cookies.remove('user', {path: '/'});
            resolve(false);
        }

        resolve(true);
    }))
}
