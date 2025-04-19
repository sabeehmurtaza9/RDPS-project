import { createTheme } from "@mui/material";

const getTheme = (darkMode) => {
    return createTheme({
        typography: {
            fontFamily: "Poppins, Roboto, Arial, sans-serif",
        },
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: "#4caf50",
            },
            background: {
                default: darkMode ? "#121212" : "#f4f6f8",
                paper: darkMode ? "#1e1e1e" : "#ffffff",
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                    },
                },
            },
        },
    });
};

export default getTheme;
