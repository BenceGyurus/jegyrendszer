const ping = require('ping');

const addresses = [process.env.MONGO, process.env.WEB_SERVER, process.env.HANDLE_SERVER, process.env.EMAIL_SERVER];

const main = async () => {
    setInterval(async () => {
        for(const i in addresses) {
            ping.promise.probe(addresses[i])
                .then((result) => {
                    console.log(`${new Date().toISOString()} ${addresses[i]}: ${result.alive ? 'Online' : 'Offline'}`);
                    if (result.alive) {
                        console.log(`  Round-Trip Time (RTT): ${result.time} ms`);
                    }
                })
                .catch((error) => {
                    console.error(`Error while pinging ${addresses[i]}: ${error.message}`);
                  });
        }
    }, 10000)
}

main();