import React from "react";
import { Grid } from "@mui/material";
import VirusTable from "../components/VirusTable";
import Settings from "../components/Settings";

const Dashboard = () => {
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                <VirusTable />
            </Grid>
            <Grid size={4}>
                <Settings />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
