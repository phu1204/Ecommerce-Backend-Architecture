'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick( object, fileds )
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map( item => [item, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map( item => [item, 0]))
}

const updateNestedObjectPaser = obj =>{
    const final = {}
    Object.keys(obj).forEach( k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectPaser(obj[k])
            Object.keys(response).forEach( a => { 
                final[`${k}.${a}`] = response[a]
            })
        }
        else{
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInfoData, getSelectData, unGetSelectData, updateNestedObjectPaser
}