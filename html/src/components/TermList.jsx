import React, { useEffect, useState, useMemo } from 'react';
import {  } from 'react-router-dom';
import { Row, Col, Button, Tooltip, List, Avatar, Tag, Space, Input, Popconfirm, message } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';
import NProgress from 'nprogress';
import 'xterm/css/xterm.css';
import termLogo from '../public/img/sw.png';
import Term from './Term';
import { useAuth } from '../context';
import termCss from '../public/less/TermList.module.less';

const url = 'http://192.168.206.128/';

let fetchListInterval;

/**
 * 用于保存term内容信息
 */
const logs = {};

/**
 * 用于保存socket
 */
const socket = {};

/**
 * 用于建立pid和devNo映射关系
 */
const pidDevNo = {};

function equalTermList(arr1, arr2) {
    if(arr1.length !== arr2.length) {
        return false;
    }
    for(let i = 0; i < arr1.length; i++) {
        if((arr1[i].isbusy !== arr2[i].isbusy) || (arr1[i].user !== arr2[i].user)) {
            return false;
        }
    }
    return true;
}

/**
 * 终端列表
 * @param {Object} props 
 */
function TermList(props) {

    const { user, logout } = useAuth();

    const [ termList, setTermList ] = useState([]);
    const [ selectTerm, setSelectTerm ] = useState(null);
    const [ searchCondition, setSearchCondition ] = useState('');
    const [ isBusy, setIsBusy ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                NProgress.start();
                const res = await axios.get(url + 'termManager/term/list');
                NProgress.done(true);
                if(res.status === 200 && Array.isArray(res.data)) {
                    setTermList(res.data);
                }
            } catch (error) {
                NProgress.done(true);
                console.log('get term list fail');
                console.log(error);
            }
        };

        const intervalFetchData = async () => {
            try {
                const res = await axios.get(url + 'termManager/term/list?' + Math.random().toString(36).slice(-8));
                if(res.status === 200 && Array.isArray(res.data) && !equalTermList(res.data, termList)) {
                    setTermList(res.data);
                }
            } catch (error) {
                console.log('get term list fail');
                console.log(error);
            }
        };

        fetchData();

        /**
         * 轮询更新设备列表状态
         */
        fetchListInterval = setInterval(() => {
            intervalFetchData();
        }, 3000);
        
        
        return () => {
            clearInterval(fetchListInterval);
        }
    }, [ selectTerm ]);

    /**
     * 选择的终端变化才触发Term子节点的重新渲染
     */
    const term = useMemo(() => {
        return <Term devNo={selectTerm} socket={socket} pidDevNo={pidDevNo} logs={logs}  onClose={setSelectTerm} setStatus={setIsBusy}></Term> 
    }, [ selectTerm, setSelectTerm, setIsBusy ]);

    const freeTerm = async (id) => {
        try {
            const res = await axios.delete(url + 'termManager/term/' + id);
            if(res.status === 200) {
                if(res.data.code === 0) message.success('连接已成功关闭');
                else if(res.data.code === 1) message.warn('无效的终端');
            }else {
                message.error('关闭连接错误');
            }
        } catch (error) {
            message.error('关闭连接错误');
        }
    }

    const userLogout = () => {
        for (const devNo in socket) {
            if (socket.hasOwnProperty(devNo)) {
                socket[devNo].close();
            }
        }
        logout();
    }

    const handleSelectTerm = id => {
        setIsBusy(false);
        setSelectTerm(id);
    }

    const filteTermList = () => {
        return termList.filter(term => (term.name.indexOf(searchCondition) !== -1 || term.ip.indexOf(searchCondition) !== -1))
    }

    return (
        <>
            <Row style={{height: '10vh', width: '100%'}} justify="center" align="middle">
                <Col className={[termCss.test].join(' ')}>
                    <Tooltip title={user.nickname}><Avatar style={{width: 40, height: 40}} src={"http://localhost/" + user.avatar}></Avatar></Tooltip>
                    <button onClick={() => userLogout()}>注销</button>
                </Col>
            </Row>
            <Row justify="center" style={{height: '100%', width: '100%'}} gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, {xs: 8, sm: 16, md: 24, lg: 32}]}>
                <Col xs={24} sm={24} md={14} lg={14}>
                    { (selectTerm === null || isBusy) ? <><Row justify="center" align="middle" style={{height: 600, backgroundColor: '#000000'}}><Col style={{color: '#3efffb', border: 'double'}}>请点击右侧列表选择设备</Col></Row></> : term }
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <SearchBar value={searchCondition} onChange={e => setSearchCondition(e.target.value)} ></SearchBar>
                    <DeviceList dataSource={filteTermList()} select={selectTerm} handleSelect={id => handleSelectTerm(id)} onConfirm={id => freeTerm(id)}></DeviceList>
                </Col>
            </Row>
        </>
    )
}

const { Search } = Input;

/**
 * 条件搜索栏
 * @param {Object} props 
 */
function SearchBar(props) {

    const condition = props.value;

    const handleSearch = props.onChange;

    return (
        <>
            <Search value={condition} onChange={handleSearch} placeholder="请输入搜索条件" />
        </>
    )
}


/**
 * 设备列表组件
 * @param {Object} props 
 */
function DeviceList(props) {

    const devList = props.dataSource;

    const select = props.select;

    const handleSelect = props.handleSelect;

    const onConfirm = props.onConfirm;
    return (
        <>
            <List itemLayout="horizontal" dataSource={devList} 
                renderItem={item => (
                    <List.Item style={select === item.id ? {backgroundColor: '#96fcff'} : {}}
                        extra={item.isbusy ? <Popconfirm title="确定关闭此设备连接？" onConfirm={() => onConfirm(item.id)} okText="确定" cancelText="取消">
                                <Button type="text"><CloseCircleTwoTone twoToneColor="#eb2f96" /></Button>
                            </Popconfirm> : <></>}>
                        <List.Item.Meta
                            avatar={<Avatar src={termLogo} />}
                            title={<Space><a onClick={() => handleSelect(item.id)}>{item.name}</a>{item.isbusy ? <Tag color="purple">{ item.user + '正在使用' }</Tag> : <Tag color="green">空闲</Tag>}</Space>}
                            description={item.ip}
                        />
                    </List.Item>
                )}>
            </List>
        </>
    )
    
}

export default TermList;