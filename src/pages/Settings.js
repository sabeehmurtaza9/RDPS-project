import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { enableNotification } from "../utils/notifications";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Settings = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Application Theme</TableCell>
                                <TableCell>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={darkMode ? 'dark' : 'light'}
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Notifications Enabled?</TableCell>
                                <TableCell>
                                    {Notification.permission === 'default' ? (
                                        <Button variant="contained" onClick={enableNotification}>
                                            Enable Notification
                                        </Button>
                                    ) : Notification.permission === 'granted' ? (
                                        <Typography component="span" color="green">Enabled</Typography>
                                    ) : (
                                        <Typography component="span" color="red">Disabled</Typography>
                                    )}
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
