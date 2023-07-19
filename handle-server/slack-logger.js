const {WebClient} = require('@slack/web-api')

class Logger {
    constructor(){
        this.client = new WebClient(process.env.SLACK_TOKEN)
    }
    sendMessage = async (message) => {
        await this.client.chat.postMessage({
            channel: "jegyrendszer-logs",
            text: message,
        })
    }
    err = async (message) => {
        await this.client.chat.postMessage({
            channel: "jegyrendszer-logs",
            attachments: [
                {
                    color: '#FF0000',
                    blocks: [
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "ERROR"
                            }
                        },
                        {
                            type: 'divider'
                        },
                        {
                            type: 'section',
                            text: {
                                type: 'plain_text',
                                text: message,
                            }
                        },
                        {
                            type: 'context',
                            elements: [
                                {
                                    type: 'plain_text',
                                    text: new Date().toUTCString(),
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
    warn = async (message) => {
        await this.client.chat.postMessage({
            channel: "jegyrendszer-logs",
            attachments: [
                {
                    color: '#f2c744',
                    blocks: [
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "WARNING"
                            }
                        },
                        {
                            type: 'divider'
                        },
                        {
                            type: 'section',
                            text: {
                                type: 'plain_text',
                                text: message,
                            }
                        },
                        {
                            type: 'context',
                            elements: [
                                {
                                    type: 'plain_text',
                                    text: new Date().toUTCString(),
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
    log = async (message) => {
            await this.client.chat.postMessage({
                channel: "jegyrendszer-logs",
                text: `LOG - ${message}`,
            })
    }

}

module.exports = Logger;