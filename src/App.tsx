/**
 * @file Root application component — router, theme, and session guard.
 *
 * Renders the MUI dark theme provider and React Router with four routes.
 * Before the session is restored (checked via {@link useRestoreSession}),
 * only the theme provider is rendered — this blocks the router and all
 * pages from mounting until we know whether the user is authenticated.
 *
 * @see {@link docs/architecture.md#session-restoration-on-reload} — session restore docs
 * @see {@link docs/architecture.md#component-tree} — full component tree
 */

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

/**
 * Route guard — redirects unauthenticated users to `/login`.
 *
 * Wraps the main app layout so that `/app` is only accessible when
 * `RivuletState.loggedIn` is `true`.
 */
function ProtectedRivulet() {
    const loggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn);
    if (!loggedIn) return <Navigate to="/login" replace />;
    return <Rivulet />;
}

/**
 * Root application component.
 *
 * Waits for session restoration before rendering the router and routes.
 * While waiting, only the {@link ThemeProvider} is rendered (no router).
 *
 * | Route | Component | Description |
 * |---|---|---|
 * | `/` | → redirect to `/login` | Default route |
 * | `/login` | `Login` | Login/signup form |
 * | `/app` | `ProtectedRivulet` | Main app (requires auth) |
 * | `/invite/:inviteId` | `Invite` | Invite link handler |
 */
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