import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './theme/theme';
import { Login } from './login/Login';
import { Rivulet } from './rivulet-main/Rivulet';

export default function App(){
    return (
    <ThemeProvider theme={darkTheme}>
    <StrictMode>
    <Router>
    <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/app">Rivulet</Link>
    </nav>

    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Rivulet/>} />
    </Routes>
    </Router>
    </StrictMode>
    </ThemeProvider>
    )
}