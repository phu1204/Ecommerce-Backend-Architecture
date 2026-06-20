'use strict'

const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('clientReady', () => {
    console.log(`Discord Bot is Ready ${client.user.tag}`)
})

const token = 'MTUxNzk5MzI4MjMxODEwNjcyNA.G0MS0X.LkxA5lcBV-CR5U_Y0CjRNbVetxD-jYuz1PaaoA'
client.login(token)

client.on('messageCreate', msg => {
    if(msg.author.bot) return;
    if(msg.content === 'hello'){
        msg.reply(`Hello, How are you today`)
    }
})