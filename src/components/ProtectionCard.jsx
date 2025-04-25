import React, { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";
import { Card, CardContent, Typography, Switch, FormControlLabel } from "@mui/material";

const ProtectionCard = () => {
    const { settings, enableProtection, disableProtection } = useContext(SettingsContext);

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Protection
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings?.enable_protection === "true"}
                            onChange={settings?.enable_protection === "true" ? disableProtection : enableProtection}
                            color="primary"
                            size="medium"
                        />
                    }
                    label={`Ransomware Protection is ${settings?.enable_protection === "true" ? "On" : "Off"}`}
                />
            </CardContent>
        </Card>
    );
};

export default ProtectionCard;
