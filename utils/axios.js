import axios from 'axios';
import Router from 'next/router';
import {parseTokens, refreshTokens} from "./auth";
import {STATIC_ROUTES} from "utils/CONSTANTS";

import {toast} from 'react-toastify';
import NProgress from 'nprogress';

const api = axios.create({
    baseURL: `${process.env.BASE_URL}`
});

const addToken = config => {
    if (config.url !== `${process.env.REFRESH_TOKEN_URL}`) {
        const tokens = parseTokens();
        if (tokens) {
            config.headers.Authorization = 'Bearer ' + tokens.access.token;
        }
        config.headers.Accept = 'application/json; version=1.0';
    }

    return config;
}

const addProgressBar = config => {
    NProgress.start();
    return config;
}

const processResponse = response => {
    NProgress.done();
    return response;
}

const consoleResponseError = async error => {
    NProgress.done();

    if (error.response?.status === 401) {
        //Token expired? Refresh token then resend original request
        const originalRequest = error.config;
        const tokens = await refreshTokens();

        if (!tokens) {
            await Router.push(STATIC_ROUTES.LOGIN);
        } else {
            originalRequest.headers.Authorization = 'Bearer ' + tokens.access.token;
            return api(originalRequest);
        }

    } else if (error.response?.status === 403) {
        console.log('Access denied');
        toast.error(`Доступ к данному действию запрещен! ${error.config.url}`, {
            position: "top-right"
        });
    } else if (error.response?.status === 404) {
        toast.warning('404 - ресурс не найден ' + error.config.url, {
            position: "top-right"
        });
    } else if (error.response?.status === 400) {
        if (Array.isArray(error.response.data)) {
            error.response.data.map(err_msg => {
                toast.error(err_msg);
            })
        } else if (typeof error.response.data === 'object' && error.response.data !== null) {
            if(typeof error.response.data.message === 'string'){
                toast.error(error.response.data.message);
            }else if(Array.isArray(error.response.data.message)){
                error.response.data.message.map(err_msg => {
                    toast.error(err_msg);
                })
            }
        } else {
            toast.error(error.response.data);
        }


    }

    if (error.response) {
        // Request made and server responded
        console.log('Error:', error.message);
    } else if (!error.response) {
        console.error('Network connection error')
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
    }

    throw error;
}

api.interceptors.request.use(addToken);
api.interceptors.request.use(addProgressBar);
api.interceptors.response.use(processResponse, consoleResponseError);

export default api;