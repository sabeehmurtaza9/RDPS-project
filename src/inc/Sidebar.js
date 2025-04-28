import React, { useContext, useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { darkMode } = useContext(ThemeContext);

    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = [
        { icon: <DashboardIcon />, label: 'Dashboard', path: '/' },
        { icon: <SecurityIcon />, label: 'Security', path: '/security' },
        { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
        { icon: <InfoIcon />, label: 'About', path: '/about' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isExpanded ? 200 : 60,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isExpanded ? 200 : 60,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s',
                    backgroundColor: darkMode ? '#303030' : '#fff'
                },
            }}
        >
            <List sx={{ paddingTop: 0 }}>
                {/* Toggle Button */}
                <ListItem
                    disablePadding
                    sx={{
                        height: '64px'
                    }}
                >
                    <ListItemButton onClick={() => setIsExpanded(!isExpanded)}>
                        <ListItemIcon sx={{ justifyContent: 'center', minWidth: 30 }}>
                            <MenuIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <hr
                    style={{
                        border: 'none',
                        borderTop: `1px solid ${darkMode ? 'rgba(81, 81, 81, 1)' : 'rgba(224, 224, 224, 1)'}`,
                        margin: '0',
                    }}
                />
                <ListItem disablePadding>
                    <ListItemButton disabled>
                        <ListItemIcon sx={{ justifyContent: 'center', minWidth: 30 }} />
                    </ListItemButton>
                </ListItem>
                {menuItems.map((item, index) => (
                    <ListItem disablePadding key={index} sx={{ marginBottom: 2 }}>
                        <Tooltip title={!isExpanded ? item.label : ''} placement="right">
                            <ListItemButton 
                                component={Link}
                                to={item.path}
                                sx={{ minHeight: '48px' }}
                            >
                                <ListItemIcon sx={{ justifyContent: 'center', minWidth: 30 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {isExpanded && <ListItemText primary={item.label} sx={{ ml: 2 }} />}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;