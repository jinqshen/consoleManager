import axios from "axios";

const localStorageKey = '_mouse_login_token_';
const authURL = 'http://192.168.206.128/';

/**
 * axios请求拦截
 */
axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem(localStorageKey);
    config.headers = {'Authorization': token};
    return config;
});

axios.interceptors.response.use(response => {
    if(response.status === 200 && response.data.code === 999 && response.data.msg === 'token is expired') {
        window.localStorage.removeItem(localStorageKey);//token过期，删除localStorage存的token
    }
    return response;
})

async function getToken() {//从localStorage获取token
    return window.localStorage.getItem(localStorageKey);
}

async function login({ username, password }) {
    try {
        const res = await axios.post(authURL + 'termManager/login', {
            username,
            password
        }, { withCredentials: true });
        if(res.status === 200) {
            window.localStorage.setItem(localStorageKey, res.data.token);
            return res.data.token; // { id:xxx, username:xxx, token:xxx }
        }else {
            return null;
        }
    } catch (error) {
        console.log('login fail, error:' + JSON.stringify(error));
        return Promise.reject(error);
    }
    /* window.localStorage.setItem(localStorageKey, 'asdSdasdD75kr_v1KD');
    return {
        id: 10258,
        username: username,
        token: 'asdSdasdD75kr_v1KD'
    } */

}

async function oauthLogin(code) {
    try {
        const res = await axios.get(authURL + 'termManager/user/oauth/github?code=' + code, { withCredentials: true });
        if(res.status === 200) {
            window.localStorage.setItem(localStorageKey, res.data.token);
            return res.data.token; // { id:xxx, username:xxx, token:xxx }
        }else {
            return null;
        }
    } catch (error) {
        console.log('oauth login fail, error:' + JSON.stringify(error));
        return Promise.reject(error);
    }

}

async function register({ username, password }) {
    try {
        const res = await axios.post(authURL + 'termManager/register', {
            username,
            password
        }, { withCredentials: true });
        if(res.status === 200) {
            window.localStorage.setItem(localStorageKey, res.data.token);
            return res.data.token; // { id:xxx, username:xxx, token:xxx }
        }else {
            return null;
        }
    } catch (error) {
        console.log('register fail, error:' + JSON.stringify(error));
        return Promise.reject(error);
    }
    /* window.localStorage.setItem(localStorageKey, 'asdSdasdD75kr_v1KD');
    return {
        id: 10258,
        username: username,
        token: 'asdSdasdD75kr_v1KD'
    } */
}

async function logout() { //注销操作，从localStorage删除token
    window.localStorage.removeItem(localStorageKey);
    /* try {
        const res = await axios.get(authURL + '/logout', { withCredentials: true });
        if(res.status === 200) {
            window.localStorage.removeItem(localStorageKey);
        }
    } catch (error) {
        console.log('logout fail, error:' + JSON.stringify(error));
        return Promise.reject(error);
    } */
    //window.localStorage.removeItem(localStorageKey);
}



export default { getToken, login, oauthLogin, register, logout };