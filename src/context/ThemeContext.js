import React, { createContext, useState, useEffect, useContext } from "react";
import { SettingsContext } from "./SettingsContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const settingsContext = useContext(SettingsContext);
    const [darkMode, setDarkMode] = useState(null);

    useEffect(() => {
        if (darkMode === null && settingsContext.settings?.dark_mode) {
            const savedMode = settingsContext.settings?.dark_mode || "false";
            setDarkMode(savedMode === "true");
        }
    }, [darkMode, settingsContext.settings]);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            const val = !prevMode;
            settingsContext.saveSettings("dark_mode", val.toString());
            return val;
        });
    };

    return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};
