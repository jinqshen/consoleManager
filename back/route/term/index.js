const router = require('express').Router();
const pty = require('node-pty');
const sw_data = require('../../model/device'); //引入device模块单例

const terminals = {};//通过pid为key保存终端对象
const logs = {};//通过pid为key保存初始日志
const devNos = {};//通过pid为key保存设备id


router.get('/list', (req, res) => {
    res.send(sw_data);
});

/**
 * 创建终端
 */
router.post('/create', (req, res) => {
    let cols = parseInt(req.body.cols);
    let rows = parseInt(req.body.rows);
    let devNo = parseInt(req.body.devNo);
    let device;
    sw_data.forEach(item => {
        if(item.id === devNo) {
            device = item;
        }
    });
    if(device.isbusy) {//设备繁忙，返回code:1，不创建终端
        res.send({
            code: 1,
            pid: null
        });
    }else {//设备空闲，返回code:0，创建终端并返回pid
        const cmd_args = device.protrol === 'telnet' ? [device.ip, device.port] : [device.ip, '-p', device.port];
        const ptyProcess = pty.spawn(device.protrol, cmd_args, {
            name: 'xterm-color',
            cols: cols || 80,
            rows: rows || 30,
            cwd: process.env.HOME,
            env: process.env
        });
        if(ptyProcess) {  //终端创建成功
            device.isbusy = true; //设置设备状态为繁忙
            device.user = req.user.nickname; //设置设备使用用户
            terminals[ptyProcess.pid] = ptyProcess;
            logs[ptyProcess.pid] = '';//存储初始打印消息
            devNos[ptyProcess.pid] = device.id;//建立pid与设备id映射关系

            ptyProcess.on('data', data => {
                logs[ptyProcess.pid] += data;
            });
            console.log('terminal start, pid:' + ptyProcess.pid.toString());
            res.send({
                code: 0,
                pid: ptyProcess.pid.toString()
            });
        }
    }
});

/**
 * 调整大小
 */
router.post('/:pid/size', function(req, res) {
    let pid = parseInt(req.params.pid),
        cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows);
    let term = terminals[pid];
    if(term === undefined) {
        res.sendStatus(401);
    } else {
        term.resize(cols, rows);
        res.sendStatus(200);
    }
});

/**
 * websocket连接
 */
router.ws('/websocket/:pid', function(ws, req) {
    let pid = req.params.pid;
    var term = terminals[pid];//获取当前连接的终端对象
    if(terminals[pid]) {
        ws.send(logs[pid]);
        term.on('data', data => {
            try {
                ws.send(data);
            } catch (error) {
                console.log('websocket might not open');
                console.log(error);
            }
        });

        term.on('exit', (exitCode, signal) => {
            console.log('exit' + exitCode);
            console.log(signal);
            if(ws.readyState !== 3)  ws.close();
        })

        ws.on('message', msg => {
            term.write(msg);
        });

        ws.on('close', () => {
            console.log('terminal exit, pid:' + term.pid);
            term.kill('SIGINT');
            sw_data[devNos[term.pid]].isbusy = false;//释放设备
            sw_data[devNos[term.pid]].user = '';
            delete terminals[term.pid];
            delete logs[term.pid];
            delete devNos[term.pid];
        });
    }
});

/**
 * 手动关闭设备连接接口
 */
router.delete('/:devNo', (req, res, next) => {
    let _pid, device;
    const devNo = parseInt(req.params.devNo);
    sw_data.forEach(item => {
        if(item.id === devNo) {
            device = item;
        }
    });
    for (const pid in devNos) {
        if (devNos[pid] === devNo) {
            _pid = pid;
        }
    }
    if(_pid) {
        if(terminals[_pid]) terminals[_pid].kill('SIGINT');//如果终端对象还在，则kill
        device.isbusy = false;
        res.send({
            code: 0,
            msg: 'success'
        });
    }else {
        res.send({
            code: 1,
            msg: 'not found device'
        });
    }
})



module.exports = router;