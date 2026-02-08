import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { HashRouter } from "react-router-dom"
import { useAppStore } from "./store/useAppStore"

const Root = () => {
  const { darkMode } = useAppStore();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#6366f1" : "#4f46e5",
        light: "#818cf8",
        dark: "#3730a3",
      },
      secondary: {
        main: darkMode ? "#f472b6" : "#ec4899",
        light: "#f9a8d4",
        dark: "#be185d",
      },
      background: {
        default: darkMode ? "#0f172a" : "#f8fafc",
        paper: darkMode ? "#1e293b" : "#ffffff",
      },
      success: {
        main: "#10b981",
      },
      warning: {
        main: "#f59e0b",
      },
      error: {
        main: "#ef4444",
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 12,
            fontWeight: 600,
            padding: '10px 20px',
            boxShadow: 'none',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
            },
          },
          contained: {
            background: darkMode 
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            '&:hover': {
              background: darkMode
                ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            },
          },
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            transition: 'all 0.3s ease-in-out',
          },
          elevation2: {
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.08)',
          },
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: darkMode 
              ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '4px 8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: darkMode
                ? 'rgba(99, 102, 241, 0.15)'
                : 'rgba(79, 70, 229, 0.08)',
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
                : 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)',
              '&:hover': {
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)'
                  : 'linear-gradient(135deg, rgba(79, 70, 229, 0.18) 0%, rgba(124, 58, 237, 0.18) 100%)',
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              '&.Mui-focused': {
                boxShadow: darkMode
                  ? '0 0 0 3px rgba(99, 102, 241, 0.2)'
                  : '0 0 0 3px rgba(79, 70, 229, 0.1)',
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
    }
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
