import React from 'react';
import { Terminal } from 'xterm';
import { Row, Col, message } from 'antd';
import axios from 'axios';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import { useState, useRef } from 'react';
import { useEffect } from 'react';

const url = 'http://192.168.206.128/';
const socketHost = '192.168.206.128';

let timeTip = null;

function Term(props) {

    const devNo = props.devNo;
    const [ cols, setCols ] = useState(80);
    const [ rows, setRows ] = useState(30);
    
    const setIsBusy = props.setStatus;

    const setSelectTerm = props.onClose;

    const termNode = useRef();

    console.log(props);
    
    useEffect(() => {
        if(devNo !== null) {
            let pid;

            /**
             * 终端初始化
             */
            const term = new Terminal();
                        
            const fitAddon = new FitAddon();
            const webLinksAddon = new WebLinksAddon();
            const searchAddon = new SearchAddon();

            term.loadAddon(fitAddon);
            term.loadAddon(webLinksAddon);
            term.loadAddon(searchAddon);

            window.addEventListener('resize', () => resizeScreen());

            const createTerminal = async () => {
                try {
                    const res = await axios.post(url + 'termManager/term/create', {
                        cols,
                        rows,
                        devNo
                    });
                    pid = res.data.pid;
                    if(pid) {//如果终端创建成功
                        setIsBusy(false);
                        props.pidDevNo[devNo] = pid;
                        term.open(termNode.current);
                        fitAddon.fit();
                        term.onResize(size => {
                            if(!pid) return;
                            try {
                                axios.post(url + 'termManager/term/' + pid + '/size?cols=' + size.cols + '&rows=' + size.rows);
                            } catch (error) {
                                console.log('resize request fail');
                                console.log(error);
                            }
                        });
                        props.socket[devNo] = new WebSocket('ws://' + socketHost + '/termManager/term/websocket/' + res.data.pid + '?token=' + window.localStorage.getItem('_mouse_login_token_'));//创建连接终端webprops.socket
                        props.socket[devNo].onopen = () => { term.loadAddon(new AttachAddon(props.socket[devNo])) };
                        props.socket[devNo].onmessage = (event) => { 
                            if(!props.logs[devNo]) props.logs[devNo] = '';
                            props.logs[devNo] += event.data;//存放消息
                        };
                        props.socket[devNo].onclose = () => {
                            console.log('与服务器连接丢失');
                            delete props.logs[devNo]; //删除存放的消息
                            delete props.socket[devNo]; //删除已存在的props.socket连接对象
                            delete props.pidDevNo[devNo];
                            term.dispose();
                            setSelectTerm(null);
                            setIsBusy(true);
                        };
                        props.socket[devNo].onerror = () => {
                            console.log('webprops.socket连接服务器失败');
                            term.dispose();
                            setIsBusy(true);
                        }
                    }else {
                        message.warn('终端正忙，创建终端失败');
                        console.log('终端正忙，创建终端失败');
                        setIsBusy(true);
                    }
                } catch (error) {
                    setIsBusy(true);
                    console.log('create terminal fail');
                    console.log(error);
                }
            }

            const resizeScreen = () => {
                clearTimeout(timeTip);//多次触发防抖动
                timeTip = setTimeout(() => {
                    try {
                        fitAddon.fit();
                    } catch (e) {
                        console.log("e", e.message);
                    }
                }, 500);
            }

            const attachDevice = async () => {
                if(props.socket[devNo]) {//如果已经有该设备连接的websocket，则清空终端，替换终端websocket，边监听新事件
                    console.log(props.logs[devNo]);
                    setIsBusy(false);
                    console.log(termNode.current);
                    term.open(termNode.current);
                    fitAddon.fit();
                    term.loadAddon(new AttachAddon(props.socket[devNo]));
                    term.onResize(size => {
                        if(!props.pidDevNo[devNo]) return;
                        try {
                            axios.post(url + 'termManager/term/' + props.pidDevNo[devNo] + '/size?cols=' + size.cols + '&rows=' + size.rows);
                        } catch (error) {
                            console.log('resize request fail');
                            console.log(error);
                        }
                    });
                    props.socket[devNo].onclose = () => {
                        console.log('与服务器连接丢失');
                        delete props.logs[devNo]; //删除存放的消息
                        delete props.socket[devNo]; //删除已存在的socket连接对象
                        delete props.pidDevNo[devNo];
                        term.dispose();
                        setSelectTerm(null);
                        setIsBusy(true);
                    };
                    if(props.logs[[devNo]])   term.write(props.logs[devNo]);//如果之前存有消息，则回显之前的消息
                    
                }else {
                    createTerminal();
                }
            };

            attachDevice();

            return () => {
                term.dispose();//销毁之前的终端
            }
        }
    });

    const fullScreen = () => {
        if(termNode.current.requestFullscreen) {
            termNode.current.requestFullscreen();
        }
    }

    return (
        <>
            <Row style={{height: 600}}>
                 <Col style={{width: '100%', height: '100%'}} onDoubleClick={fullScreen} span={24} ref={ node => termNode.current = node }>

                </Col>
            </Row>
        </>
    )


}

export default Term;