const http = require('http')

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    // 注册中间件
    register(path, ...args) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stack = args // 中间件数组
        } else {
            info.path = '/'
            info.stack = [path, ...args]
        }
        return info
    }

    use() {
        const info = this.register(...arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register(...arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register(...arguments)
        this.routes.post.push(info)
    }

    handle(req, res, stack) {
        const next = () => {
            const middleware = stack.shift()
            if (middleware) {
                middleware(req, res, next)
            }
        }
        next()
    }

    match(url, method) {
        let stack = []
        if (url === '/favicon.ico') return stack

        // 获取 可能要执行的 中间件列表
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        // 根据url过滤
        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' && routeInfo.path === '/'
                // url === '/api/get-cookie' && routeInfo.path === '/api'
                // url === '/api/get-cookie' && routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(url, method) // 需要执行的中间件
            this.handle(req, res, resultList) // 逐个中间件执行
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = () => {
    return new LikeExpress()
}
