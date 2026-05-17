'use strict'

const mongoose = require('mongoose')
const { db: { userName, password, name} } = require('../configs/config.mongo.js')
const connectString = `mongodb://${userName}:${password}@ac-bbw0jih-shard-00-00.m9okqa5.mongodb.net:27017,ac-bbw0jih-shard-00-01.m9okqa5.mongodb.net:27017,ac-bbw0jih-shard-00-02.m9okqa5.mongodb.net:27017/?ssl=true&replicaSet=atlas-sez8hc-shard-0&authSource=admin&appName=${name}`

const { countConnect } = require('../helpers/checkConnect')

class Database {
    constructor(){
        this.connect()
    }
    
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString).then(_ => {
            maxPoolSize: 50;
            console.log(`Connected MongoDB Server Pro`, countConnect())
        }).catch( err => console.log(`Errors Connect`, err))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMonggodb = Database.getInstance()


module.exports = instanceMonggodb