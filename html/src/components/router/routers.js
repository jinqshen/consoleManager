import React from 'react';

const TermList = React.lazy(() => import('../TermList'));
const Login = React.lazy(() => import('../Login'));

const routers = {
    auth: [
        {
            path: "/",
            element: <TermList/>
        }
    ],
    unauth: [
        {
            path: "/",
            element: <Login/>
        }
    ]
}

export default routers;