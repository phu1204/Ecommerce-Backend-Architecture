'use strict'

const _ = require('lodash')

const convertToObjectIdMongodb = (id) => {
    return new mongoose.Types.ObjectId(id)
}

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick( object, fileds )
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map( item => [item, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map( item => [item, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k => {
        if(obj[k] === null){
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectPaser = obj =>{
    const final = {}
    Object.keys(removeUndefinedObject(obj)).forEach( k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectPaser(obj[k])
            Object.keys(response).forEach( a => { 
                console.log(`[1]::`, a)
                final[`${k}.${a}`] = response[a]
            })
        }
        else{
            final[k] = obj[k]
        }
    })
    console.log(`[2]::`, final)
    return final    
}

module.exports = {
    convertToObjectIdMongodb,
    getInfoData, getSelectData, unGetSelectData, removeUndefinedObject, updateNestedObjectPaser
}