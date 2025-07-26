import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Login } from './login/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d1b2a',
      contrastText: '#688896',
    },
    background: {
      default: '#1b2631',
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
  <StrictMode>
    <Login />
  </StrictMode>
  </ThemeProvider>
)
