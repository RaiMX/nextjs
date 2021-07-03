import api from "./axios";

export const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
}

export const testApi = () => {
    api.post('api/').then(res => {
        console.log(res.data);
    }).catch(error => {
        alert(error.message);
    })
}