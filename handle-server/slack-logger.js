// const {WebClient} = require('@slack/web-api')

const { Logger, createLogger, format, transport, transports } = require("winston");
const LokiTransport = require("winston-loki");

// class Logger {
//     constructor(){
//         this.client = new WebClient(process.env.SLACK_TOKEN)
//     }
//     sendMessage = async (message) => {
//         await this.client.chat.postMessage({
//             channel: "jegyrendszer-logs",
//             text: message,
//         })
//     }
//     err = async (message) => {
//         await this.client.chat.postMessage({
//             channel: "jegyrendszer-logs",
//             attachments: [
//                 {
//                     color: '#FF0000',
//                     blocks: [
//                         {
//                             type: "header",
//                             text: {
//                                 type: "plain_text",
//                                 text: "ERROR"
//                             }
//                         },
//                         {
//                             type: 'divider'
//                         },
//                         {
//                             type: 'section',
//                             text: {
//                                 type: 'plain_text',
//                                 text: message,
//                             }
//                         },
//                         {
//                             type: 'context',
//                             elements: [
//                                 {
//                                     type: 'plain_text',
//                                     text: new Date().toUTCString(),
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         })
//     }
//     warn = async (message) => {
//         await this.client.chat.postMessage({
//             channel: "jegyrendszer-logs",
//             attachments: [
//                 {
//                     color: '#f2c744',
//                     blocks: [
//                         {
//                             type: "header",
//                             text: {
//                                 type: "plain_text",
//                                 text: "WARNING"
//                             }
//                         },
//                         {
//                             type: 'divider'
//                         },
//                         {
//                             type: 'section',
//                             text: {
//                                 type: 'plain_text',
//                                 text: message,
//                             }
//                         },
//                         {
//                             type: 'context',
//                             elements: [
//                                 {
//                                     type: 'plain_text',
//                                     text: new Date().toUTCString(),
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         })
//     }
//     log = async (message) => {
//             await this.client.chat.postMessage({
//                 channel: "jegyrendszer-logs",
//                 text: `LOG - ${message}`,
//             })
//     }

// }

// module.exports = Logger;



let logger;

const initLocalLogger = ()=>{
    logger = createLogger({
        transports: [
            new transports.Console({
                format: format.combine(format.simple(), format.colorize())
            })
        ]
    })   
    console.log('Local logger is initialized');
}
const initLogger = () => {
    if(logger) return;

    if (process.env.NODE_ENV == 'production'){
        try{
        logger = createLogger({
            transports: [
                new LokiTransport({
                    host: process.env.LOKI_URL,
                    labels: {app: 'handle'},
                    json: true,
                    format: format.json(),
                    replaceTimestamp: true,
                    onConnectionError: (err) => console.error(err),
                }),
            ]
        })
        console.log('Remote logger is initialized');
        }catch{
            console.log("Remote logger couldn't be initialized")
            initLocalLogger();
        }
    }else{
        initLocalLogger();
    }

}

const getLogger = () => {
    initLogger();
    return logger;
}

module.exports = getLogger;