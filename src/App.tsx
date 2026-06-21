import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import currentTheme from './theme/theme';
import { Login } from './pages/login/Login';
import { Rivulet } from './pages/rivulet-main/Rivulet';
import { Invite } from './pages/invite/Invite';
import { useRestoreSession } from './hooks/useRestoreSession';
import type { RootState } from './stores/store';

function ProtectedRivulet() {
    const loggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn);
    if (!loggedIn) return <Navigate to="/login" replace />;
    return <Rivulet />;
}

export default function App() {
    const sessionRestored = useRestoreSession();

    if (!sessionRestored) {
        return (
            <ThemeProvider theme={currentTheme}>
                <StrictMode />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={currentTheme}>
            <StrictMode>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/app" element={<ProtectedRivulet />} />
                        <Route path="/invite/:inviteId" element={<Invite />} />
                    </Routes>
                </Router>
            </StrictMode>
        </ThemeProvider>
    );
}