import React, { createContext, useEffect } from "react";
import { API_URL } from "../utils/urls";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = React.useState({});

    const loadSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings`);
            const data = await response.json();
            if (!data.success) {
                throw new Error("Failed to load settings");
            }
            setSettings(data.data);
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    };

    const saveSettings = async (key, value) => {
        try {
            await fetch(`${API_URL}/api/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key, value }),
            });
            setSettings({ ...settings, [key]: value });
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    const selectWatchedFolderSetting = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings/select-watched-folder`);
            const data = await response.json();
            if (!data.success) {
                console.error("Failed to select watched folder settings:", data.message);
                throw new Error("Failed to select watched folder settings");
            }
            saveSettings("watched_dir_path", data.data.folder_path);
        } catch (error) {
            console.error("Error to select watched folder settings:", error);
        }
    };

    const enableProtection = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings/protection/enable`);
            const data = await response.json();
            if (!data.success) {
                console.error("Failed to start protection in setting:", data.message);
                throw new Error("Failed to start protection in setting");
            }
            saveSettings("enable_protection", "true");
        } catch (error) {
            console.error("Error to start protection in setting:", error);
        }
    };

    const disableProtection = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings/protection/disable`);
            const data = await response.json();
            if (!data.success) {
                console.error("Failed to start protection in setting:", data.message);
                throw new Error("Failed to start protection in setting");
            }
            saveSettings("enable_protection", "false");
        } catch (error) {
            console.error("Error to start protection in setting:", error);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider
            value={{ settings, saveSettings, selectWatchedFolderSetting, enableProtection, disableProtection }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
