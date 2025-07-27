import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Login } from './login/Login'
import { ThemeProvider } from '@mui/material/styles'
import darkTheme from './theme/theme'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
  <StrictMode>
    <Login />
  </StrictMode>
  </ThemeProvider>
)
