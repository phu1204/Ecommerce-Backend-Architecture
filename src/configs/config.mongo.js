'use strict'

//lv0
const dev0 = {
    app: {
        port: 3050
    },
    db: {
        userName: 'phun1204',
        password: '12042001',
        name: 'shopDev'
    }
}

//lv1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3050
    },
    db: {
        userName: process.env.DEV_DB_USERNAME || 'phun1204',
        password: process.env.DEV_DB_PW || 12042001,
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_DB_PORT || 3050
    },
    db: {
        userName: process.env.PRO_DB_USERNAME || 'phun1204',
        password: process.env.PRO_DB_PW || 12042001,
        name: process.env.PRO_DB_NAME || 'shopPro'
    }
}

const config = {dev, pro};
const env = process.env.NODE_ENV || 'dev'
// console.log(config[env], env)
module.exports = config[env]
