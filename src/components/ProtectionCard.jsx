import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Card, CardContent, Typography, Switch, FormControlLabel } from "@mui/material";

const ProtectionCard = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Protection
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="primary"
                            size="medium"
                        />
                    }
                    label={`Ransomware Protection is ${darkMode ? "On" : "Off"}`}
                />
            </CardContent>
        </Card>
    );
};

export default ProtectionCard;
