module.exports = {
    initialiseRouter: (app) => {
        app.use("/api/settings", require("./SettingsRouter"));
    }
};