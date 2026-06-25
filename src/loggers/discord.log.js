"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { CHANNEL_ID, TOKEN_DISCORD } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = CHANNEL_ID;

    this.client.on("clientReady", () => {
      console.log(`Discord Bot is Ready ${this.client.user.tag}`);
    });
 
    this.client.login(TOKEN_DISCORD);
  }

  sendToFormatCode(logData){
    const { code, message = 'This is some addditional infomation about the code', title = "Code Example"} = logData

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }
    this.sendToMessage(codeMessage)
  }
  
  sendToMessage( message = 'message'){
    const channel = this.client.channels.cache.get(this.channelId)
    if(!channel){
        console.error(`Couldn't find the channel`, this.channelId)
        return
    }

    channel.send(message).catch(e => console.error(e))
  }
}

const loggerService = new LoggerService()
module.exports = loggerService
