import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

function LoginTextField(props: any) {
    return (
        <TextField
            fullWidth
            sx={{
                    backgroundColor: 'primary.contrastText',
                    '& .MuiInputLabel-root': {
                        color: 'white'
                    },
                    '& .MuiOutlinedInput-input': {
                        color: 'white'
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
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
            <Stack spacing={2}> 
            <div style={ { 
                textAlign: 'center', 
                fontSize: '24px',
            }}> Login </div>
            <LoginTextField label="Username" />
            <LoginTextField label="Password" type="password" />

            </Stack>
        </Box>
        
    );
}

export default LoginEntry;