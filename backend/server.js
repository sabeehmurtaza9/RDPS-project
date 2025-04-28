const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const { initializeDB } = require("./db/init");
const { initialiseRouter } = require("./routers/init");
const { monitor } = require("./scripts/process");
const { isPortInUse } = require("./utils/process");
const { getSettings } = require("./controllers/SettingsController");
const PORT = process.env.EXPRESS_PORT || 5001;

app.use(cors());
app.use(express.json());

initializeDB();
initialiseRouter(app);

app.get("/", (req, res) => {
    res.send("Express server is running!");
});

app.listen(PORT, async () => {
    const settings = getSettings();
    if (settings?.enable_protection === "true") {
        const checkForServer = setInterval(() => {
            isPortInUse(process.env.FLASK_PORT ?? 6001).then((isInUse) => {
                if (isInUse) {
                    monitor.start();
                    clearInterval(checkForServer);
                }
            }).catch((err) => {
                console.error("Error checking port:", err);
                clearInterval(checkForServer);
            });
        }, 5000);
    }
    const quarantinePath = path.resolve(__dirname, "../quarantine");
    fs.chmod(quarantinePath, 0o766, (err) => {
        if (err) {
            console.error(`Failed to remove execute permissions from ${quarantinePath}:`, err);
        } else {
            console.log(`Execute permissions removed from ${quarantinePath}.`);
        }
    });
    console.log(`Express server is running on port ${PORT}.`);
});
