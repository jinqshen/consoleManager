const router = require('express').Router();

router.get('/music/list', (req, res, next) => {
    res.send([
        {
            "id": 0,
            "name": "新·九九八十一 + 爱殇 + 蒹葭白露 + 天地有道 (Live)",
            "author": "肥皂菌、小时姑娘、方颂评、易言",
            "filename": "/music/song/肥皂菌、小时姑娘、方颂评、易言 - 新·九九八十一 + 爱殇 + 蒹葭白露 + 天地有道 (Live).mp3",
            "lrc": "/music/lrc/肥皂菌、小时姑娘、方颂评、易言 - 新·九九八十一 + 爱殇 + 蒹葭白露 + 天地有道 (Live).lrc",
            "cover": "/music/cover/icon1.jpg"
        },{
            "id": 1,
            "name": "海伦 - 桥边姑娘",
            "author": "海伦",
            "filename": "/music/song/海伦 - 桥边姑娘.flac",
            "lrc": "/music/lrc/海伦 - 桥边姑娘.lrc",
            "cover": "/music/cover/icon2.jpeg"
        },{
            "id": 2,
            "name": "小时 - 爱殇",
            "author": "小时姑娘",
            "filename": "/music/song/小时 - 爱殇.flac",
            "lrc": "/music/lrc/小时 - 爱殇.lrc",
            "cover": "/music/cover/icon3.jpeg"
        },{
            "id": 3,
            "name": "小星星Aurora - 坠落星空",
            "author": "小星星Aurora",
            "filename": "/music/song/小星星Aurora - 坠落星空.flac",
            "lrc": "/music/lrc/小星星Aurora - 坠落星空.lrc",
            "cover": "/music/cover/icon4.png"
        },{
            "id": 4,
            "name": "杨千嬅 - 处处吻",
            "author": "杨千嬅",
            "filename": "/music/song/杨千嬅 - 处处吻.flac",
            "lrc": "/music/lrc/杨千嬅 - 处处吻.lrc",
            "cover": "/music/cover/icon5.png"
        },{
            "id": 5,
            "name": "中島美嘉 - 僕が死のうと思ったのは (曾经我也想过一了百了)",
            "author": "中島美嘉",
            "filename": "/music/song/中島美嘉 - 僕が死のうと思ったのは (曾经我也想过一了百了).flac",
            "lrc": "/music/lrc/中島美嘉 - 僕が死のうと思ったのは (曾经我也想过一了百了).lrc",
            "cover": "/music/cover/icon6.jpeg"
        },{
            "id": 6,
            "name": "Dave Rodgers - Déjà Vu",
            "author": "Dave Rodgers",
            "filename": "/music/song/Dave Rodgers - Déjà Vu.mp3",
            "lrc": "/music/lrc/Dave Rodgers - Déjà Vu.lrc",
            "cover": "/music/cover/icon7.jpeg"
        },{
            "id": 7,
            "name": "傅如乔 - 微微",
            "author": "傅如乔",
            "filename": "/music/song/傅如乔 - 微微.flac",
            "lrc": "/music/lrc/傅如乔 - 微微.lrc",
            "cover": "/music/cover/icon8.jpeg"
        },{
            "id": 8,
            "name": "胡彦斌、白举纲 - 单恋一枝花 (Live)",
            "author": "胡彦斌、白举纲",
            "filename": "/music/song/胡彦斌、白举纲 - 单恋一枝花 (Live).flac",
            "lrc": "/music/lrc/胡彦斌、白举纲 - 单恋一枝花 (Live).lrc",
            "cover": "/music/cover/icon9.jpeg"
        },{
            "id": 9,
            "name": "霍尊 - 天行九歌",
            "author": "霍尊",
            "filename": "/music/song/霍尊 - 天行九歌.flac",
            "lrc": "/music/lrc/霍尊 - 天行九歌.lrc",
            "cover": "/music/cover/icon10.jpeg"
        }
    ])
})

module.exports = router;