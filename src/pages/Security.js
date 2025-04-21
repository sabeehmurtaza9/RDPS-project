import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import dummyData from "../data/dummyData";

const Security = () => {
    return (
        <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Security
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
                                    <strong>Blocked</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dummyData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.fileName}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.blocked ? "✅ Yes" : "❌ No"}</TableCell>
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
