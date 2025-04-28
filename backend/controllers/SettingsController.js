const { default: collect } = require("collect.js");
const { db } = require("../db/init");
const osa = require("node-osascript");
const { monitor } = require("../scripts/process");

const getSettings = () => {
    const qry = db.prepare("SELECT var_key, var_value FROM settings");
    const result = qry.all();
    return collect(result)
        .mapWithKeys((r) => [r.var_key, r.var_value])
        .all();
}

module.exports = {
    getSettings,
    index: (req, res) => {
        try {
            const result = getSettings();
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No settings found",
                });
            }
            return res.json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error("Error retrieving settings:", err);
            return res.status(500).json({
                success: false,
                message: "Error retrieving settings",
            });
        }
    },
    store: (req, res) => {
        try {
            const { key, value } = req.body;
            if (!key || value === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Key is required and value must be provided",
                });
            }
            const qry = db.prepare("UPDATE settings SET var_value = ? WHERE var_key = ?");
            const result = qry.run(value, key);
            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Setting not found",
                });
            }
            return res.json({
                success: true,
                message: "Setting updated successfully",
            });
        } catch (err) {
            console.error("Error updating settings:", err);
            return res.status(500).json({
                success: false,
                message: "Error updating settings",
            });
        }
    },
    selectWatchedFolder: async (req, res) => {
        try {
            const script = `POSIX path of (choose folder with prompt "Select a folder")`;
            osa.execute(script, (err, result) => {
                if (err) {
                    console.error("Folder selection error:", err);
                    return res.status(500).json({ success: false, message: "Failed to select folder" });
                }
                res.json({ success: true, data: { folder_path: result.trim() } });
            });
        } catch (err) {
            console.error("Folder selection canceled or error:", err);
            res.status(500).json({ success: false, message: "Folder selection was canceled or failed" });
        }
    },
    enableProtection: async (req, res) => {
        try {
            monitor.start();
            res.json({ success: true, data: {} });
        } catch (err) {
            console.error("Error starting protection:", err);
            res.status(500).json({ success: false, message: "Error starting protection" });
        }
    },
    disableProtection: async (req, res) => {
        try {
            monitor.stop();
            res.json({ success: true, data: {} });
        } catch (err) {
            console.error("Error stopping protection:", err);
            res.status(500).json({ success: false, message: "Error stopping protection" });
        }
    },
};
