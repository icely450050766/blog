var express = require('express');
var router = express.Router();
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {login} = require('../controller/user')

router.post('/login', function (req, res, next) {
    const result = login(req)
    return result.then(data => {
        if (data) {
            // 设置session，自动同步redis
            req.session.username = data.username
            req.session.realname = data.realname
            res.json(new SuccessModel(data))
        } else {
            res.json(new ErrorModel('登录失败'))
        }
    }, () => {
        res.json(new ErrorModel('登录失败'))
    })
});

module.exports = router;
