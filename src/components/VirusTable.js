import React from 'react';
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
} from '@mui/material';
import dummyData from '../data/dummyData';

const VirusTable = () => {
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
                <TableCell><strong>File Name</strong></TableCell>
                <TableCell><strong>Path</strong></TableCell>
                <TableCell><strong>Blocked</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.fileName}</TableCell>
                  <TableCell>{row.path}</TableCell>
                  <TableCell>{row.blocked ? '✅ Yes' : '❌ No'}</TableCell>
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