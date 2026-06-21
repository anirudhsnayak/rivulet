/**
 * @file Invite received modal — accepts or declines a pending server invite.
 *
 * When a user navigates to `/invite/:inviteId` and logs in (or is already
 * logged in), this modal displays with Accept / Decline buttons. Accepting
 * joins the server via {@link joinServerWithInvite}; declining clears the
 * pending invite from Redux.
 *
 * @see {@link setPendingInvite} — Redux action that stores the invite code
 * @see {@link Invite} — landing page that dispatches the invite code
 * @see {@link docs/architecture.md#receiving-an-invite} — invite flow docs
 */

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

/** Centered modal card styling with a mail icon header. */
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

/** Horizontal row for the Accept / Decline buttons. */
const buttonRow = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
};

/**
 * Invite received modal — prompts the user to accept or decline a server
 * invite.
 *
 * Visible when {@link RivuletState.pendingInvite} is non-null (i.e. the
 * user arrived via an invite link). On accept, joins the server and
 * clears the invite. On decline, simply clears the invite.
 */
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
