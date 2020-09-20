import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context';
import loginCss from '../public/less/Login.module.less';
import logo from '../public/img/console.svg';

function Login(props) {
    const { login } = useAuth();

    const onFinish = (values) => {
        login(values);
    }

    return (
        <>
            <Row justify="center" align="middle" className={[loginCss.wrap].join(' ')}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        >
                        <Form.Item>
                            <div className={[loginCss.header]}>
                                Console
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '用户名必填' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '密码必填' }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="请输入密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <div className={ [loginCss.ball1].join(' ') }></div>
            <div className={ [loginCss.ball2].join(' ') }></div>
            <div className={ [loginCss.ball3].join(' ') }></div>
            <div className={ [loginCss.ball4].join(' ') }></div>
            <div className={ [loginCss.ball5].join(' ') }></div>
            <div className={ [loginCss.ball6].join(' ') }></div>
            <div className={ [loginCss.ball1].join(' ') }></div>
        </>
    )
}

export default Login;