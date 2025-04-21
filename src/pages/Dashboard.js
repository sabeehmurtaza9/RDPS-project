import React from "react";
import { Grid } from "@mui/material";
import VirusTable from "../components/VirusTable";
import ProtectionCard from "../components/ProtectionCard";

const Dashboard = () => {
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                <VirusTable />
            </Grid>
            <Grid size={4}>
                <ProtectionCard />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
