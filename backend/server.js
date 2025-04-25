const express = require("express");
const { initialiseDB } = require("./db/init");
const { initialiseRouter } = require("./routers/init");
const app = express();
const cors = require("cors");
const { monitor } = require("./utils/process");
const { getSettings } = require("./controllers/SettingsController");
const PORT = process.env.EXPRESS_PORT || 5001;

app.use(cors());
app.use(express.json());

initialiseDB();
initialiseRouter(app);

app.get("/", (req, res) => {
    res.send("Express server is running!");
});

app.listen(PORT, () => {
    const settings = getSettings();
    if (settings?.enable_protection === "true") {
        monitor.start();
    }
    console.log(`Express server is running on port ${PORT}.`);
});
