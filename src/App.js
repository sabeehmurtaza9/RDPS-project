import React, { useContext } from 'react';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Header from './components/Header';
import Sidebar from './inc/Sidebar';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box } from '@mui/material';
import { ThemeContext } from './context/ThemeContext';
import getTheme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <MuiThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Header />
                <Box sx={{ padding: 2, width: '100%' }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/security" element={<Security />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
