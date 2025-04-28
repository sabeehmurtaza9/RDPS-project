const { db } = require("../db/init");
const path = require("path");
const fs = require("fs");

module.exports = {
    index: (req, res) => {
        try {
            const qry = db.prepare("SELECT * FROM viruses order by created_at desc");
            const result = qry.all();
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No viruses found",
                });
            }
            return res.json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error("Error retrieving viruses:", err);
            return res.status(500).json({
                success: false,
                message: "Error retrieving viruses",
            });
        }
    },
    allowFile: (req, res) => {
        try {
            const qry = db.prepare("SELECT * FROM viruses WHERE id = ?");
            const fileRecord = qry.get(req.params.id);
            if (!fileRecord) {
                return res.status(404).json({
                    success: false,
                    message: "File not found in quarantine",
                });
            }
            const { quarantine_path, file_path } = fileRecord;
            if (!fs.existsSync(quarantine_path)) {
                return res.status(404).json({
                    success: false,
                    message: "Quarantined file does not exist",
                });
            }
            fs.renameSync(quarantine_path, file_path);
            const updateQry = db.prepare("UPDATE viruses SET allowed_at = ? WHERE id = ?");
            updateQry.run(new Date().toISOString(), req.params.id);
            return res.json({
                success: true,
                message: "File has been allowed successfully",
            });
        } catch (err) {
            console.error("Error allowing file:", err);
            return res.status(500).json({
                success: false,
                message: "Error allowing file",
            });
        }
    },
    removeFile: (req, res) => {
        try {
            const qry = db.prepare("SELECT * FROM viruses WHERE id = ?");
            const fileRecord = qry.get(req.params.id);
            if (!fileRecord) {
                return res.status(404).json({
                    success: false,
                    message: "File not found in quarantine",
                });
            }
            const { quarantine_path } = fileRecord;
            if (!fs.existsSync(quarantine_path)) {
                return res.status(404).json({
                    success: false,
                    message: "Quarantined file does not exist",
                });
            }
            fs.unlinkSync(quarantine_path);
            const updateQry = db.prepare("UPDATE viruses SET removed_at = ? WHERE id = ?");
            updateQry.run(new Date().toISOString(), req.params.id);
            return res.json({
                success: true,
                message: "File has been removed successfully",
            });
        } catch (err) {
            console.error("Error removing file:", err);
            return res.status(500).json({
                success: false,
                message: "Error removing file",
            });
        }
    },
};
