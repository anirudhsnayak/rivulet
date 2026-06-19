import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import currentTheme from './theme/theme';
import { Login } from './pages/login/Login';
import { Rivulet } from './pages/rivulet-main/Rivulet';
import { Invite } from './pages/invite/Invite';

export default function App() {
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setShowNav(e.clientY < 50);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <ThemeProvider theme={currentTheme}>
            <StrictMode>
                <Router>
                    {showNav && (
                        <nav
                            style={{
                                position: 'absolute',
                                background: 'rgba(0, 0, 0, 1)',
                                width: '100%',
                                padding: '0.25rem',
                            }}
                        >
                            <Link to="/login">Login</Link> |{" "}
                            <Link to="/app">Rivulet</Link>
                        </nav>
                    )}

                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/app" element={<Rivulet />} />
                        <Route path="/invite/:inviteId" element={<Invite />} />
                    </Routes>
                </Router>
            </StrictMode>
        </ThemeProvider>
    );
}