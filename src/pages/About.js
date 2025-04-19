import { Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

const About = () => {
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            About
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This project name is <strong>{process.env.REACT_APP_PROJECT_NAME || 'Project name comes here'}</strong>. It is developed by Sabeeh Murtaza Mirza with Student ID (22085589) as a MSc Cyber Security final project.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Thank you for checking out this project! Happy coding!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Version:</strong> 1.0.0
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Technologies
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {['ReactJS', 'Material UI', 'NodeJS', 'Python', 'Machine Learning', 'Bash Scripting'].map((tech, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{tech}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Developer
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                        <TableCell>Sabeeh Murtaza Mirza</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                        <TableCell>22085589</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                                        <TableCell>MSc Cyber Security</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>University</TableCell>
                                        <TableCell>University of Hertfordshire</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Supervisor</TableCell>
                                        <TableCell>Sydney Ezika</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Services Status
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Service</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Frontend Server</TableCell>
                                        <TableCell>
                                            <Typography component="span" sx={{ color: (theme) => theme.palette.success.main }}>
                                                Active
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Backend Server</TableCell>
                                        <TableCell>
                                            <Typography component="span" sx={{ color: (theme) => theme.palette.success.main }}>
                                                Active
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Background Service</TableCell>
                                        <TableCell>
                                            <Typography component="span" sx={{ color: (theme) => theme.palette.success.main }}>
                                                Active
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ML Server</TableCell>
                                        <TableCell>
                                            <Typography component="span" sx={{ color: (theme) => theme.palette.success.main }}>
                                                Active
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default About;