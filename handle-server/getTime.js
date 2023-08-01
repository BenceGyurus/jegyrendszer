const fs = require("fs");


const readConfig = () => {
    try {
        let config = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`));
        return config;
    }catch(err){
        console.log('failed to read config file, check env variables');
    }
}

const getTime = (key)=>{
    let timeConfigPath = readConfig();
    if (timeConfigPath){
        try{
            let datas = JSON.parse(fs.readFileSync(timeConfigPath.TIMES));
            if (datas && typeof datas == "object"){
                return datas[key];
            }
            return 0;
        }
        catch{
            return 0;
        }
    }
}


module.exports = getTime;