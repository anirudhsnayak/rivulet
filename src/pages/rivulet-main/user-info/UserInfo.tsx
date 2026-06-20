import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import currentTheme from '../../../theme/theme';
import { SettingsModal } from './SettingsModal';

function UserInfo() {
    const username = useSelector((state: RootState) => state.RivuletState.currentUserName);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Box
            sx={{
                height: '5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                backgroundColor: 'primary.main',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                margin: '0.25rem',
                borderLeft: `3px solid ${currentTheme.palette.tabs.main}`,
            }}
        >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {username}
            </Typography>
            <Settings
                onClick={() => setSettingsOpen(true)}
                sx={{
                    color: 'text.disabled',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    '&:hover': {
                        color: currentTheme.palette.tabs.main,
                    },
                }}
            />
        </Box>
        </>
    );
}

export { UserInfo };
