import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import React from 'react';

function LoginTextField(props: any) {
    return (
        <TextField
            fullWidth
            sx={{
                backgroundColor: 'primary.contrastText',
                '& .MuiInputLabel-root': {
                    color: 'text.primary'
                },
                '& .MuiFilledInput-input': {
                    color: 'text.primary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'text.secondary'
                }
            }}
            label={props.label}
            color='primary'
            variant="filled"
            margin="normal"
            {...props}
        />
    );
}

function LoginEntry() {
    /* React Component */
    const LoginTab = styled(Tab)(({ theme }) => ({
        color: theme.palette.text.primary,
        '&.Mui-selected': {
            color: theme.palette.tabs.tabTextSelected,
        },
        
        // '&:hover': {
        //     color: theme.palette.button.main,
        // },
    }));
    
    
    const [value, setValue] = React.useState('login');
    function handleChange(event: React.SyntheticEvent, newValue: string) {
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
                    <LoginTab label="Sign Up" value="sign up"/>
                </TabList>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}>

                    <TabPanel value="login">
                        <Stack spacing={2}>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '24px',
                            }}> Login </div>
                            <LoginTextField label="Username" />
                            <LoginTextField label="Password" type="password" />
                            <Button
                                fullWidth
                                sx={{
                                    backgroundColor: 'button.main',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: 'primary.light'
                                    }
                                }}
                                variant="contained">LOGIN</Button>
                        </Stack>
                    </TabPanel>
                    <TabPanel value="sign up">
                    </TabPanel>
                </div>
            </TabContext>
        </Box>
    );
}

export default LoginEntry;