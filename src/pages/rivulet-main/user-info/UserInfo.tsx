import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';

function UserInfo() {
    const username = useSelector((state: RootState) => state.RivuletState.currentUserName);

    return (
        <Box
            sx={{
                height: '5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                backgroundColor: 'primary.main',
                borderTop: '1px solid',
                borderColor: 'divider',
                borderRadius: '0 12px 0 0',
            }}
        >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {username}
            </Typography>
            <Settings sx={{ color: 'text.disabled', fontSize: '1.25rem', cursor: 'pointer' }} />
        </Box>
    );
}

export { UserInfo };
