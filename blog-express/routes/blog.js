var express = require('express');
var router = express.Router();
const loginCheck = require('../middleware/loginCheck')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

router.get('/list', function (req, res, next) {
    // 管理员界面，强制查询自己的博客
    if (req.query.isadmin) {
        // 登录验证
        if (!req.session.username) {
            res.json(new ErrorModel('尚未登录'))
            return
        }
        req.query.author = req.session.username
    }
    const result = getList(req)
    return result.then(data => {
        res.json(new SuccessModel(data))
    }, () => {
        res.json(new ErrorModel('获取博客列表失败'))
    })
});

router.get('/detail', function (req, res, next) {
    const result = getDetail(req)
    return result.then(data => {
        res.json(new SuccessModel(data))
    }, () => {
        res.json(new ErrorModel('获取博客详情失败'))
    })
});

router.post('/new', loginCheck, function (req, res, next) {
    req.body.author = req.session.username // 作者
    const result = newBlog(req)
    return result.then(data => {
        data ? res.json(new SuccessModel(data)) : res.json(new ErrorModel('新建博客失败'))
    }, () => {
        res.json(new ErrorModel('新建博客失败'))
    })
});
router.post('/update', loginCheck, function (req, res, next) {
    req.body.author = req.session.username // 作者
    const result = updateBlog(req)
    return result.then(data => {
        data ? res.json(new SuccessModel('更新博客成功')) : res.json(new ErrorModel('更新博客失败'))
    }, () => {
        res.json(new ErrorModel('更新博客失败'))
    })
});
router.post('/del', loginCheck, function (req, res, next) {
    req.body.author = req.session.username // 作者
    const result = delBlog(req)
    return result.then(data => {
        data ? res.json(new SuccessModel('删除博客成功')) : res.json(new ErrorModel('删除博客失败'))
    }, () => {
        res.json(new ErrorModel('删除博客失败'))
    })
});

module.exports = router;
