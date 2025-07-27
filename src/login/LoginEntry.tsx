import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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
    return (
        <Box
            sx={{
                width: 400,
                height: 400,
                backgroundColor: 'primary.main',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
        </Box>

    );
}

export default LoginEntry;