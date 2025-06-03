'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'CREATED'
}

class SuccessReponse {
    constructor({message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }){
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers={}){
        return res.status( this.status ).json(this)
    }
}

class OK extends SuccessReponse {
    constructor({message, metadata}){
        super({message, metadata})
    }
}

class CREATED extends SuccessReponse {
    constructor({options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata}){
        super({message, metadata, statusCode, reasonStatusCode})
        this.options = options
    }
}

module.exports = {
    OK,
    CREATED
}