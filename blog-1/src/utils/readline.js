const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.join(__dirname, '../../', 'logs', 'access.log')
const readStream = fs.createReadStream(fileName)

const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

// 逐行读取
rl.on('line', (lineData) => {
    if (!lineData) return
    sum++ // 记录总行数

    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') >= 0) {
        chromeNum++
    }
})

// 监听读取完成
rl.on('close', () => {
    console.log('chrome占比：', chromeNum / sum)
})