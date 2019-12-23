const router = require('koa-router')()
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {login} = require('../controller/user')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
    console.log(ctx.request)
    const result = await login(ctx.request)
    if (result) {
        // 设置session，自动同步redis
        ctx.session.username = result.username
        ctx.session.realname = result.realname
        ctx.body = new SuccessModel(result)
    } else {
        ctx.body = new ErrorModel('登录失败')
    }
})

module.exports = router
