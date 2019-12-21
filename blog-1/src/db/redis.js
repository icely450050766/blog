const redis = require('redis')
const {REDIS_CONF} = require('../conf/db')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    // val必须为字符串
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val === null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val)) // 转json
            } catch (e) {
                resolve(val)
            }
        })
    })
}

// 退出
// redisClient.quit()

module.exports = {
    set,
    get
}