const xss = require('xss'); // 避免前端把<script>脚本作为博客内容
const {exec, escape} = require('../db/mysql')

const getList = (req) => {
    const author = escape(req.query.author || '')
    const keyword = escape(req.query.keyword || '')
    let sql = `select * from blogs where 1=1 ` // 1=1是为了处理当 author, keyword都为空的情况
    if (author !== "''") {
        sql += `and author=${author} `
    }
    if (keyword !== "''") {
        sql += `and title like %${keyword}% `
    }
    sql += `order by createtime desc`
    return exec(sql)
}

const getDetail = (req) => {
    const id = escape(req.query.id || '')
    let sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows => {
        if (rows.length) return rows[0]
        return {}
    })
}

const newBlog = (req) => {
    const title = xss(escape(req.body.title || ''))
    const content = xss(escape(req.body.content || ''))
    const author = escape(req.body.author || '')
    const createTime = +new Date()
    let sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, ${createTime}, ${author});`
    return exec(sql).then(res => {
        console.log(res);
        return (res.affectedRows === 1) ? {id: res.insertId} : null
    })
}

const updateBlog = (req) => {
    const id = escape(req.query.id || '')
    const author = escape(req.body.author || '')
    const title = xss(escape(req.body.title || ''))
    const content = xss(escape(req.body.content || ''))
    let sql = `update blogs set title=${title}, content=${content} where author=${author} and id=${id}`
    return exec(sql).then(res => {
        console.log(res)
        return (res.affectedRows > 0) // true/false
    })
}

const delBlog = (req) => {
    const id = escape(req.body.id || req.query.id || '')
    const author = escape(req.body.author || '')
    let sql = `delete from blogs where id=${id} and author=${author}`
    return exec(sql).then(res => {
        console.log(res);
        return (res.affectedRows > 0) // true/false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
