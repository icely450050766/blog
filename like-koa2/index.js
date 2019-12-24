const http = require('http')

// 组合中间件
function compose(middlewareList) {
    return function (ctx) {
        // 中间件调用
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                // 每个中间件是一个async函数，返回的是一个promise
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }

        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn)
        return this
    }

    createContext(req, res) {
        const ctx = {
            request: req,
            response: res
        }
        ctx.query = req.query
        ctx.method = req.method
        ctx.url = req.url
        return ctx
    }

    // 设置ctx的body属性：ctx.body = {…}
    setCtxBody(ctx) {
        let temp = ''
        Object.defineProperty(ctx, 'body', {
            get() {
                return temp
            },
            set(val) {
                temp = val
                ctx.response.setHeader('Content-type', 'application/json')
                ctx.response.end(JSON.stringify(temp))
            }
        })
    }

    callback() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            this.setCtxBody(ctx)
            fn(ctx)// 调用中间件
        }
    }

    listen(...arg) {
        const server = http.createServer(this.callback())
        server.listen(...arg)
    }
}

module.exports = LikeKoa2
