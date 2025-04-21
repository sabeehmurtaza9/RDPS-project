const { default: collect } = require("collect.js");
const { db } = require("../db/init");

module.exports = {
    index: (req, res) => {
        try {
            const qry = db.prepare("SELECT var_key, var_value FROM settings");
            const result = qry.all();
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No settings found"
                });
            }
            return res.json({
                success: true,
                data: collect(result).mapWithKeys(r => [r.var_key, r.var_value]).all()
            });
        } catch (err) {
            console.error("Error retrieving settings:", err);
            return res.status(500).json({
                success: false,
                message: "Error retrieving settings"
            });
        }
    }
};