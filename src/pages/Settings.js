import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Card, CardContent, Typography } from "@mui/material";

const Settings = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                <Button variant="contained" onClick={toggleDarkMode}>
                    {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Settings;
