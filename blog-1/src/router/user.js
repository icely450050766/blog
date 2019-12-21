const {SuccessModel, ErrorModel} = require('../model/resModel')
const {login} = require('../controller/user')
const {set} = require('../db/redis')

const handleUserRouter = function (req, res) {
    const {method, path} = req

    // 登录
    if (path === '/api/user/login' && method === 'POST') {
        const result = login(req)
        return result.then(data => {
            if (data) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                // 同步redis
                set(req.sessionId, req.session)
                return new SuccessModel(data)
            } else {
                return new ErrorModel('登录失败')
            }
        }, rej => {
            return new ErrorModel('登录失败')
        })
    }

    // 登录验证测试
    // if (path === '/api/user/login-test' && method === 'GET') {
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }

    return null
}

module.exports = handleUserRouter
