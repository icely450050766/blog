const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
    // 管理员界面，强制查询自己的博客
    if (ctx.query.isadmin) {
        // 登录验证
        if (!ctx.session.username) {
            ctx.body = new ErrorModel('尚未登录')
            return
        }
        ctx.query.author = ctx.session.username
    }
    const result = await getList(ctx)
    ctx.body = new SuccessModel(result)
})

router.get('/detail', async (ctx, next) => {
    const result = await getDetail(ctx)
    ctx.body = new SuccessModel(result)
})

router.post('/new', async (ctx, next) => {
    ctx.request.body.author = ctx.session.username // 作者
    const result = await newBlog(ctx.request)
    ctx.body = result ? new SuccessModel(result) : new ErrorModel('新建博客失败')
})

router.post('/update', async (ctx, next) => {
    ctx.request.body.author = ctx.session.username // 作者
    const result = await updateBlog(ctx.request)
    ctx.body = result ? new SuccessModel('更新博客成功') : new ErrorModel('更新博客失败')
})

router.post('/del', async (ctx, next) => {
    ctx.request.body.author = ctx.session.username // 作者
    const result = await delBlog(ctx.request)
    ctx.body = result ? new SuccessModel('删除博客成功') : new ErrorModel('删除博客失败')
})

module.exports = router
