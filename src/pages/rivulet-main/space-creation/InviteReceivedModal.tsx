import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import type { RootState } from '../../../stores/store';
import { setPendingInvite } from '../../../stores/slices/RivuletSlice';
import { joinServerWithInvite } from '../../../api/UserModelAPI';
import { RivuletButton } from '../../../components/RivuletButton';

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
    gap: '1.5rem',
    minWidth: '300px',
};

const buttonRow = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
};

export function InviteReceivedModal() {
    const dispatch = useDispatch();
    const pendingInvite = useSelector((state: RootState) => state.RivuletState.pendingInvite);


    const handleAccept = useCallback(async () => {
        if (!pendingInvite) return;
        await joinServerWithInvite(pendingInvite);
        dispatch(setPendingInvite(null));
    }, [pendingInvite, dispatch]);

    const handleDecline = useCallback(() => {
        dispatch(setPendingInvite(null));
    }, [dispatch, pendingInvite]);

    return (
        <Modal open={!!pendingInvite}>
            <Box sx={style}>
                <MarkEmailRead sx={{ fontSize: '3rem', color: 'text.primary' }} />

                <Typography variant="h6" component="h2" sx={{ color: 'text.primary', textAlign: 'center' }}>
                    You&apos;re Invited!
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Someone wants you to join their server.
                </Typography>

                <Box sx={buttonRow}>
                    <RivuletButton name="Accept" onClick={handleAccept} />
                    <RivuletButton name="Decline" onClick={handleDecline} />
                </Box>
            </Box>
        </Modal>
    );
}
