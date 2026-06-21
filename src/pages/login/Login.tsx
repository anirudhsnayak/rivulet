import LoginSignupEntry from './LoginSignupEntry';
import Box from '@mui/material/Box';

/**
 * Login page — route-level component rendered at `/login`.
 *
 * Renders a full-viewport centered container with a dark theme background
 * and places the {@link LoginSignupEntry} tabbed login/signup form inside it.
 *
 * @see {@link LoginSignupEntry} — the tabbed form for authentication
 * @see {@link architecture.md | docs/architecture.md#login-flow} — full login flow documentation
 *
 * @example Route registration (in App.tsx)
 * ```tsx
 * <Route path="/login" element={<Login />} />
 * ```
 */
function Login() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                width: '100vw', // Full viewport width
                backgroundColor: 'background.default', // Use theme's default background color
            }}
        >
            <LoginSignupEntry />
        </Box>
    );
}

export { Login };