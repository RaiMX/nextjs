import axios from 'axios';
import {logout} from "./auth";

import {toast} from 'react-toastify';

const addToken = config => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    if (userToken) {
        config.headers.Authorization = 'Token ' + userToken.token;
    }

    config.headers.Accept = 'application/json; version=1.0';

    return config;
}

const processResponse = response => {
    return response;
}

const consoleResponseError = error => {

    if (error.response?.status === 401) {
        logout();
    } else if (error.response?.status === 403) {
        console.log('Access denied');
        toast.error('Доступ к данному действию запрещен!', {
            position: "top-center"
        });
    } else if (error.response?.status === 404) {
        toast.warning('404 - ресурс не найден', {
            position: "top-right"
        });
    } else if (error.response?.status === 400) {
        if (Array.isArray(error.response.data)) {
            error.response.data.map(err_msg => {
                toast.error(err_msg);
            })
        } else if (typeof error.response.data === 'object' && error.response.data !== null) {
            for (const errorKey in error.response.data) {
                if (error.response.data.hasOwnProperty(errorKey)) {
                    error.response.data[errorKey].map(err_msg => {
                        toast.error(`${errorKey}: ${err_msg}`);
                    })
                }
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

const api = axios.create({
    baseURL: `http://${window.location.hostname}:${process.env.REACT_APP_NGINX_PORT}/`
});

api.interceptors.request.use(addToken);
api.interceptors.response.use(processResponse, consoleResponseError);

export default api;