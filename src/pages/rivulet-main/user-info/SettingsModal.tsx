import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RivuletButton } from '../../../components/RivuletButton';
import { handleLogout } from '../../../controllers/login/LoginController';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid',
    borderColor: 'primary.lighter',
    borderRadius: '8px',
    backgroundColor: 'primary.main',
    padding: '2rem 3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '320px',
};

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
    const navigate = useNavigate();

    const handleLogoutClick = useCallback(async () => {
        await handleLogout();
        navigate('/login');
    }, [navigate]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ color: 'text.primary' }}>
                    Settings
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Log out of your account
                </Typography>

                <RivuletButton name="Logout" onClick={handleLogoutClick} />
            </Box>
        </Modal>
    );
}
