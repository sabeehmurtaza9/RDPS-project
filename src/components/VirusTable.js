import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { API_URL } from "../utils/urls";
import dayjs from "dayjs";

const VirusTable = () => {
    const [viruses, setViruses] = React.useState([]);

    const loadViruses = async () => {
        try {
            const response = await fetch(`${API_URL}/api/security`);
            const data = await response.json();
            if (!data.success) {
                throw new Error("Failed to load viruses");
            }
            setViruses(data.data);
        } catch (error) {
            console.error("Error loading viruses:", error);
        }
    };

    useEffect(() => {
        loadViruses();
    }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Detected Ransomware Files
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>File Name</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Path</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Quarantined?</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Allowed?</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Removed?</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {viruses.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.file_name}</TableCell>
                                    <TableCell><small>{row.file_path}</small></TableCell>
                                    <TableCell align="center">
                                        <div>{!row.allowed_at && !row.removed_at && row.quarantine_at ? "✅ Yes" : "❌ No"}</div>
                                        {!row.allowed_at && !row.removed_at && row.quarantine_at && (
                                            <>
                                                <div>
                                                    <em>{dayjs(row.quarantine_at).format('DD/MM/YYYY')}</em>
                                                </div>
                                                <em>{dayjs(row.quarantine_at).format('(hh:mm A)')}</em>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.allowed_at ? "✅ Yes" : "❌ No"}</div>
                                        {row.allowed_at && (
                                            <>
                                                <div>
                                                    <em>{dayjs(row.allowed_at).format('DD/MM/YYYY')}</em>
                                                </div>
                                                <em>{dayjs(row.allowed_at).format('(hh:mm A)')}</em>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.removed_at ? "✅ Yes" : "❌ No"}</div>
                                        {row.removed_at && (
                                            <>
                                                <div>
                                                    <em>{dayjs(row.removed_at).format('DD/MM/YYYY')}</em>
                                                </div>
                                                <em>{dayjs(row.removed_at).format('(hh:mm A)')}</em>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default VirusTable;
