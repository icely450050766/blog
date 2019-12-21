// const express = require('express');
const express = require('./index');
const app = express();

app.use((req, res, next) => {
    console.log('请求开始', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    console.log('处理cookie')
    req.cookie = {
        name: 'icely'
    }
    next()
})

app.use('/api', (req, res, next) => {
    console.log('处理body')
    // 异步
    setTimeout(() => {
        req.body = 'this is data'
        next()
    })
})

app.get('/api/get-cookie', (req, res) => {
    console.log('/api/get-cookie')
    res.json({
        cookie: req.cookie
    })
})

// 登录验证 中间件
function loginCheck(req, res, next) {
    setTimeout(() => {
        // console.log('登录失败')
        // res.json({
        //     msg: '登录失败'
        // })
        console.log('登录成功')
        next()
    })
}

app.post('/api/get-body', loginCheck, (req, res) => {
    console.log('/api/get-body')
    res.json({
        data: req.body
    })
})

// app.use((req, res) => {
//     console.log('404 page')
//     res.json({
//         data: '404 page'
//     })
// })

app.listen(3000)
