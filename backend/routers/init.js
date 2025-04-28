module.exports = {
    initialiseRouter: (app) => {
        app.use("/api/settings", require("./SettingsRouter"));
        app.use("/api/security", require("./SecurityRouter"));
    }
};