import {
    Button,
    ButtonGroup,
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
import React, { useEffect } from "react";
import { API_URL } from "../utils/urls";
import dayjs from "dayjs";

const Security = () => {
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

    const handleAllowFile = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to allow this file?")) {
                return;
            }
            const req = await fetch(`${API_URL}/api/security/${id}/allow`);
            const res = await req.json();
            if (!res.success) {
                throw new Error("Failed to allow file");
            }
            loadViruses();
            alert('Successfully allowed the file');
        } catch (error) {
            console.error("Error allowing file:", error);
        }
    };

    const handleRemoveFile = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to remove this file?")) {
                return;
            }
            const req = await fetch(`${API_URL}/api/security/${id}/remove`);
            const res = await req.json();
            if (!res.success) {
                throw new Error("Failed to remove file");
            }
            loadViruses();
            alert('Successfully removed the file');
        } catch (error) {
            console.error("Error removing file:", error);
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
                                <TableCell>
                                    <strong>Actions</strong>
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
                                    <TableCell>
                                        {!row.allowed_at && !row.removed_at && (
                                            <ButtonGroup>
                                                <Button size="small" variant="contained" color="primary" onClick={() => handleAllowFile(row.id)}>
                                                    Allow?
                                                </Button>
                                                <Button size="small" variant="contained" color="error" onClick={() => handleRemoveFile(row.id)}>
                                                    Remove?
                                                </Button>
                                            </ButtonGroup>
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

export default Security;
