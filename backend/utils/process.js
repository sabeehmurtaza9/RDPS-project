const net = require("net");

async function isPortInUse(port, host = "127.0.0.1") {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(true);
            } else {
                reject(err);
            }
        });
        server.once("listening", () => {
            server.close(() => {
                resolve(false);
            });
        });
        server.listen(port, host);
    });
}

module.exports = {
    isPortInUse
};