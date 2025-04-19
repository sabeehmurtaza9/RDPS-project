import React from 'react';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';

const Header = () => {
    const theme = useTheme();

    return (
        <AppBar
            position="static"
            sx={{
                borderBottom: '2px solid #4caf50',
                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default,
                boxShadow: 'none',
            }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#4caf50' }}>
                    {process.env.REACT_APP_PROJECT_NAME || 'Project name comes here'}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;