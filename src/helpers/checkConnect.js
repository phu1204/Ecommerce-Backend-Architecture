'use strict'

const mongoose = require('mongoose')
const os = require('os')
const _SECONDS = 5000

const countConnect = () =>{
    const numConnect = mongoose.connections.length
    console.log(`Number of connection: ${numConnect}`)
}

const checkOverload = () =>{
    setInterval( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus.lengt;
        const memoryUsage = process.memoryUsage().rss;
        // Maximun number of connection based on number of cores
        const maxConnection = numCores * 5
        console.log(`Active Connection: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024}`)

        if(numConnection > maxConnection){
            console.log('Connection overload detecded')
        }

    }, _SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
}