/**
 * @file Settings modal — logout and account settings.
 *
 * A simple MUI Modal with a logout button. Calls {@link handleLogout}
 * from the login controller and navigates to `/login` on success.
 *
 * @see {@link UserInfo} — parent component that controls this modal
 * @see {@link handleLogout} — controller that clears session state
 * @see {@link docs/architecture.md#known-technical-debt} — logout UI tech debt
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RivuletButton } from '../../../components/RivuletButton';
import { handleLogout } from '../../../controllers/login/LoginController';

/** Centered modal card styling. */
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

/** Props for the {@link SettingsModal} component. */
interface SettingsModalProps {
    /** Whether the modal is visible. */
    open: boolean;
    /** Callback fired when the modal requests to close. */
    onClose: () => void;
}

/**
 * Settings modal — provides a logout button for the current user.
 *
 * On logout, calls {@link handleLogout} (clears Redux state and localStorage)
 * and navigates to the login page.
 */
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
