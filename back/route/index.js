const router = require('express').Router();
const jwt = require('jsonwebtoken');
const userAuth = require('../model/userAuth');
const userInfo = require('../model/userInfo');
const AUTH_PRI_KEY = 'jinqshen';

router.use('/amuse', require('./amuse'));
router.use('/life', require('./life'));

/**
 * 用户登录接口
 */
router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let user;
    const array = userAuth.filter(user => {
        if(user.identifier === username && user.credential === password) {
            return true;
        }
    });
    console.log(array);
    if(array.length > 0) {
        user = array[0];//查询用户信息
        const uInfo = userInfo.filter(info => {
            if(info.id === user.userid) return true;
        });
        //如果用户名密码校验通过，生成token
        let token = jwt.sign(uInfo[0], AUTH_PRI_KEY, { algorithm: 'HS256', expiresIn: '7d' });
        res.send({
            token: token
        });
    }else {
        res.sendStatus(401);
    }    
});

/**
 * token拦截校验
 */
router.use('/*', (req, res, next) => {
    let token;
    if(req.headers['upgrade'] === 'websocket') {
        //websocket连接时，从query参数中获取token
        token = req.query.token;
    }else {
        token = req.headers['Authorization'] || req.headers['authorization'];
    }
    if(token) {
        try {
            let payload = jwt.verify(token, AUTH_PRI_KEY);//校验通过，放行
            req.user = payload;//将用户登录
            next();
        } catch (error) {
            if(error.name === 'TokenExpiredError') {
                console.log('token is expired');
                res.send({
                    code: 999,
                    msg: 'token is expired'
                });
            }else {
                console.log('jwt verify catch error');
                res.sendStatus(401);
            }
        }
    }else {
        res.sendStatus(401);
    }
});

/**
 * 获取用户信息
 */
router.get('/getUserInfo', (req, res, next) => {
    res.send(req.user);
});

router.use('/term', require('./term'));



module.exports = router;