import api from "./axios";

export const getUnreadCount = () => {
    return new Promise((resolve, reject) => {
        api.get('api/notifications/api/unread_count/').then(res => {
            resolve(res.data?.unread_count);
        }).catch(error => {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                reject('Ошибка сети')
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                reject(error.message)
            }
        })
    });
}

export const getUnreadNotifications = () => {
    return new Promise((resolve, reject) => {
        api.get('api/notifications/api/unread_list/').then(res => {
            resolve(res.data);
        })
    });
}

export const getAllNotifications = () => {
    return new Promise((resolve, reject) => {
        api.get('api/notifications/all/').then(res => {
            resolve(res.data);
        })
    });
}

export const markAsRead = (id) => {
    return new Promise((resolve, reject) => {
        api.get(`api/notifications/mark-as-read/${id}/`).then(res => {
            resolve(res.data);
        })
    });
}

export const markAllAsRead = () => {
    return new Promise((resolve, reject) => {
        api.get(`api/notifications/mark-all-as-read/`).then(res => {
            resolve(res.data);
        })
    });
}