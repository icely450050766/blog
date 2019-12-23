class BaseModel {
    constructor(data, msg) {
        if (typeof data === 'string') {
            msg = data
            data = null
        }
        if (data) {
            this.data = data
        }
        if (msg) {
            this.message = msg
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}