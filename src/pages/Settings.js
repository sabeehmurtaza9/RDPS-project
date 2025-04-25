import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    IconButton,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { enableNotification } from "../utils/notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { SettingsContext } from "../context/SettingsContext";
import DeleteIcon from "@mui/icons-material/Delete";

const Settings = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const { settings, saveSettings, selectWatchedFolderSetting, disableProtection, enableProtection } = useContext(SettingsContext);

    const handleSaveSettings = (key, value) => {
        saveSettings(key, value);
    };

    return (
        <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Application Theme</TableCell>
                                <TableCell>Current Theme Mode is {darkMode ? "Dark" : "Light"}</TableCell>
                                <TableCell align="right">
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={darkMode ? "dark" : "light"}
                                        exclusive
                                        onChange={toggleDarkMode}
                                        aria-label="Theme Mode"
                                        size="small"
                                    >
                                        <ToggleButton value="light">
                                            <LightModeIcon sx={{ marginRight: 1 }} />
                                            Light Mode
                                        </ToggleButton>
                                        <ToggleButton value="dark">
                                            <DarkModeIcon sx={{ marginRight: 1 }} />
                                            Dark Mode
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Notifications Enabled?</TableCell>
                                <TableCell>
                                    {Notification.permission === "default" ? (
                                        <Button variant="contained" onClick={enableNotification}>
                                            Enable Notification
                                        </Button>
                                    ) : Notification.permission === "granted" ? (
                                        <Typography component="span" color="green">
                                            Enabled
                                        </Typography>
                                    ) : (
                                        <Typography component="span" color="red">
                                            Disabled
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Watched Folder</TableCell>
                                <TableCell>
                                    {["", null, undefined].includes(settings?.watched_dir_path) ? (
                                        <>
                                            <Button variant="contained" onClick={selectWatchedFolderSetting}>
                                                Select Watched Folder
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography component="span">{settings?.watched_dir_path}</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {!["", null, undefined].includes(settings?.watched_dir_path) && (
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleSaveSettings("watched_dir_path", "")}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Enable Protection</TableCell>
                                <TableCell>
                                    {`Ransomware Protection is ${settings?.enable_protection === "true" ? "On" : "Off"}`}
                                </TableCell>
                                <TableCell align="right">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings?.enable_protection === "true"}
                                                onChange={settings?.enable_protection === "true" ? disableProtection : enableProtection}
                                                color="primary"
                                                size="medium"
                                            />
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default Settings;
