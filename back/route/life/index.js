const router = require('express').Router();


router.get('/photo/list', (req, res, next) => {
    res.send(
        [
            {
                id: 0,
                name: "小学",
                description: "some message",
                createDate: "2020年1月18日",
                defaultCover: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            },{
                id: 1,
                name: "初中",
                description: "some message",
                createDate: "2020年1月18日",
                defaultCover: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            },{
                id: 2,
                name: "高中",
                description: "some message",
                createDate: "2020年1月18日",
                defaultCover: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            },{
                id: 3,
                name: "大学",
                description: "some message",
                createDate: "2020年1月18日",
                defaultCover: "http://localhost/music/cover/icon1.jpg"
            }
        ]
    )
})

module.exports = router;