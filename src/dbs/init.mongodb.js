'use strict'

const mongoose = require('mongoose')
const { db: { userName, password, name} } = require('../configs/config.mongo.js')
const connectString =  `mongodb+srv://${userName}:${password}@${name}.m9okqa5.mongodb.net/?retryWrites=true&w=majority&appName=shopDev`

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
        
        mongoose.connect( connectString).then(_ => {
            maxPoolSize: 50;
            console.log(`Connected MongoDB Server Pro`, countConnect())
        }).catch( err => console.log(`Error Connect`))
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