const options = {};
const db = require('better-sqlite3')('system.db', options);

const initializeSettings = () => {
    const settingsStructure = {
        dark_mode: { key: 'dark_mode', value: 'true' },
        enable_protection: { key: 'enable_protection', value: 'true' },
        watched_dir_path: { key: 'watched_dir_path', value: '' },
    };

    // Fetch all existing settings keys in one query
    const existingSettings = db.prepare('SELECT var_key FROM settings').all();
    const existingKeys = new Set(existingSettings.map(setting => setting.var_key));

    // Insert only the missing settings
    for (const key in settingsStructure) {
        if (!existingKeys.has(key)) {
            const setting = settingsStructure[key];
            db.prepare('INSERT INTO settings (var_key, var_value) VALUES (?, ?)')
              .run(setting.key, setting.value);
        }
    }
}

module.exports = {
    db: db,
    initializeDB: () => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                var_key TEXT NOT NULL UNIQUE,
                var_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS viruses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT NOT NULL,
                quarantine_at TIMESTAMP,
                quarantine_path TEXT,
                removed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP,
                deleted_at TIMESTAMP
            );
        `);
        initializeSettings();
    }
};