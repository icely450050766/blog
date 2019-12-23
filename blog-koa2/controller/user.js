const {exec, escape} = require('../db/mysql')
const {genPassword} = require('../utils/cryp')

const login = async (req) => {
    const username = escape(req.body.username || '')
    let password = genPassword(req.body.password || '') // 加密
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password}`
    const rows = await exec(sql)
    return rows && rows.length ? rows[0] : null
}

module.exports = {
    login
}
