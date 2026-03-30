import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import React, { useState } from 'react';
import { handleLoginSignup } from './LoginSignupHandler';
import { RivuletTextField } from '../components/RivuletTextField';
import { RivuletButton } from '../components/RivuletButton';

function LoginSignupPortal(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <Stack spacing={2}>
            <div style={{
                textAlign: 'center',
                fontSize: '24px',
            }}> {props.name} </div>
            <RivuletTextField label="Username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
            <RivuletTextField label="Password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
            <RivuletButton name={props.name} onClick={() => handleLoginSignup(props.value, username, password)}/>
        </Stack>
    )
}

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