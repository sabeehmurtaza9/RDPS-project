import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <React.Suspense fallback={<div className="full-page-loader">Loading...</div>}>
            <SettingsProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </SettingsProvider>
        </React.Suspense>
    </React.StrictMode>
);

reportWebVitals();
