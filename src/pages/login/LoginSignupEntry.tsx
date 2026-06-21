/**
 * @file Login and signup UI — tabbed entry point for Rivulet authentication.
 *
 * @see {@link architecture.md | docs/architecture.md#login-flow} — login flow documentation
 */

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLoginSignup } from '../../controllers/login/LoginController';
import { RivuletTextField } from '../../components/RivuletTextField';
import { RivuletButton } from '../../components/RivuletButton';

/**
 * Login / Sign-up form portal rendered inside each tab panel.
 *
 * Contains the username field, password field, and submit button for one
 * authentication mode (login or signup). Uses the shared `RivuletTextField`
 * and `RivuletButton` components for a consistent look.
 *
 * On successful authentication, navigates to `/app`.
 *
 * @param props.value - Tab identifier (`"login"` or `"signup"`), forwarded to
 *                      {@link handleLoginSignup} to determine the auth mode.
 * @param props.name - Display name for the tab ("Login" or "Sign Up") used as
 *                     the form heading and button label.
 *
 * @see {@link handleLoginSignup} — controller that hashes credentials and
 *      calls the login/signup API
 */
function LoginSignupPortal(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLoginClick() {
        const success = await handleLoginSignup(props.value, username, password);
        if (success) {
            navigate('/app');
        }
    }

    return (
        <Stack spacing={2}>
            <div style={{
                textAlign: 'center',
                fontSize: '24px',
            }}> {props.name} </div>
            <RivuletTextField label="Username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
            <RivuletTextField label="Password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
            <RivuletButton name={props.name} onClick={handleLoginClick}/>
        </Stack>
    )
}

/**
 * Tabbed login/signup card — the primary authentication UI.
 *
 * Displays a centered card with "Login" and "Sign Up" tabs powered by
 * MUI's `TabContext` / `TabList` / `TabPanel`. Each tab renders a
 * {@link LoginSignupPortal} which collects credentials and delegates to
 * {@link handleLoginSignup} in the controller layer.
 *
 * The card uses custom tab styling via a styled `LoginTab` component,
 * and reads accent colours from the MUI theme palette extensions
 * (`tabs.main`, `tabs.tabTextSelected`).
 *
 * @see {@link Login} — parent page component rendered at `/login`
 * @see {@link handleLoginSignup} — controller orchestrating API call + state dispatch
 * @see {@link docs/architecture.md#login-flow} — end-to-end login sequence diagram
 */
function LoginSignupEntry() {
    const LoginTab = styled(Tab)(({ theme }) => ({
        color: theme.palette.text.primary,
        '&.Mui-selected': {
            color: theme.palette.tabs.tabTextSelected,
        },
        // '&:hover': {
        //     color: theme.palette.button.main,
        // },
    }));


    const [value, setValue] = useState('login');
    function handleChange(_: React.SyntheticEvent, newValue: string) {
        setValue(newValue);
    }
    return (
        <Box
            sx={{
                width: '27rem',
                height: '27rem',
                backgroundColor: 'primary.main',
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
            }}
        >
            <TabContext value={value}>
                <TabList onChange={handleChange} sx={{
                    width: '27rem',
                    backgroundColor: 'tabs.main',
                    color: 'text.primary',
                }} aria-label="basic tabs example">
                    <LoginTab label="Login" value="login"/>
                    <LoginTab label="Sign Up" value="signup"/>
                </TabList>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    <TabPanel value="login"> <LoginSignupPortal name="Login" value="login"/> </TabPanel>
                    <TabPanel value="signup"> <LoginSignupPortal name="Sign Up" value="signup"/> </TabPanel>
                </div>
            </TabContext>
        </Box>
    );
}

export default LoginSignupEntry;