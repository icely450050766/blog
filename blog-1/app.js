const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const {get, set} = require('./src/db/redis')
const {access} = require('./src/utils/log')

// console.log(process.env.NODE_ENV)

// 获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

// 获取post参数
const getPostData = (req) => {
    return new Promise(resolve => {
        if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString() // chunk是 二进制
        })
        req.on('end', function () {
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandler = async (req, res) => {
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    
    // 设置返回数据格式
    res.setHeader('Content-type', 'application/json')

    // 对request的 路由/参数 的处理
    const {url} = req
    req.path = url.split('?')[0] // 接口路由
    req.query = querystring.parse(url.split('?')[1]) // url参数 转json对象
    req.body = await getPostData(req) // post 数据
    // console.log('body', req.body)

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析session
    let isNeedSetCookie = false
    let userId = req.cookie.userid
    // 新登录用户，新增唯一标识
    if (!userId) {
        isNeedSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {}) // 初始化 redis 中的 session 值
    }
    req.sessionId = userId // 用于登录时更新redis
    // 获取session
    req.session = await get(userId).then(sessionData => {
        if (!sessionData) {
            sessionData = {}
            set(userId, sessionData)
        }
        return sessionData
    })
    // console.log('req.session', req.session)

    // 博客路由
    const blogResult = handleBlogRouter(req)
    if (blogResult) {
        blogResult.then(blogData => {
            if (blogData) {
                if (isNeedSetCookie) {
                    // 操作cookie（httpOnly是限制只允许后端改，不允许前端修改cookie，前端键入document.coookie也获取不到后台设置的值）
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            }
        })
        return
    }

    // 用户路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
        userResult.then(userData => {
            if (userData) {
                if (isNeedSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            }
        })
        return
    }

    // 未命中路由，返回 404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
}

module.exports = serverHandler
