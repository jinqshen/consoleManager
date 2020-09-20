import React, { useState, useContext, useEffect, useCallback, useMemo, createContext } from 'react';
import { message } from 'antd';
import auth from './auth-provider';
import axios from 'axios';

const authURL = 'http://192.168.206.128/';

const AuthContext = createContext({});

async function getUserInfo() {
    const token = await auth.getToken();
    if(token) {
        try {
            const res = await axios.get(authURL + 'termManager/getUserInfo', {withCredentials: true});
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }else {
        return null;
    }
}


function AuthProvider(props) {

    const [ user, setUser ] = useState(null);


    useEffect(() => {
        getUserInfo().then(user => setUser(user));
    }, []);

    const register = useCallback((from) => {//注册
        auth.register(from).then(() => getUserInfo())
            .then(user => setUser(user));
    }, []);

    const login = useCallback((from) => {
        auth.login(from).then(() => {
            message.success('登录成功');
            return getUserInfo();
        }, () => {
            message.error('登录失败');
            return null;
        }).then(user => setUser(user));
    }, []);

    const oauthLogin = useCallback(code => {
        auth.oauthLogin(code).then(() => getUserInfo())
            .then(user => setUser(user));
    }, []);

    const logout = useCallback(() => {
        auth.logout().then(() => setUser(null));
    }, []);

    //将值通过Context传递给子组件
    const value = useMemo(() => ({ user, register, login, oauthLogin, logout }), [ user, register, login, oauthLogin, logout ]);
    
    return <AuthContext.Provider {...props} value={value}></AuthContext.Provider>
    
}

function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('get AuthContext is undefined');
    }
    return context;
}

export { AuthProvider, useAuth };