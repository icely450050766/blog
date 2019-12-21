const {SuccessModel, ErrorModel} = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

// 登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

const handleBlogRouter = function (req) {
    const {method, path} = req

    if (path === '/api/blog/list' && method === 'GET') {
        // 管理员界面，强制查询自己的博客
        if (req.query.isadmin) {
            // 登录验证
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                return loginCheckResult
            }
            req.query.author = req.session.username
        }
        const result = getList(req)
        // return 一个promise
        return result.then(res => {
            return new SuccessModel(res)
        }, rej => {
            return new ErrorModel('获取博客列表失败')
        })
        // return data ? new SuccessModel(data) : new ErrorModel('获取博客列表失败')
    }
    if (path === '/api/blog/detail' && method === 'GET') {
        const result = getDetail(req)
        return result.then(res => {
            return new SuccessModel(res)
        }, rej => {
            return new ErrorModel('获取博客详情失败')
        })
    }

    if (path === '/api/blog/new' && method === 'POST') {
        // 登录验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        req.body.author = req.session.username // 作者
        const result = newBlog(req)
        return result.then(res => {
            return res ? new SuccessModel(res) : new ErrorModel('新建博客失败')
        }, rej => {
            return new ErrorModel('新建博客失败')
        })
    }
    if (path === '/api/blog/update' && method === 'POST') {
        // 登录验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        req.body.author = req.session.username // 作者
        const result = updateBlog(req)
        return result.then(res => {
            return res ? new SuccessModel('更新博客成功') : new ErrorModel('更新博客失败')
        }, rej => {
            return new ErrorModel('更新博客失败')
        })
    }
    if (path === '/api/blog/del' && method === 'POST') {
        // 登录验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        req.body.author = req.session.username // 作者
        const result = delBlog(req)
        return result.then(res => {
            return res ? new SuccessModel('删除博客成功') : new ErrorModel('删除博客失败')
        }, rej => {
            return new ErrorModel('删除博客失败')
        })
    }

    return null
}

module.exports = handleBlogRouter