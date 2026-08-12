import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import type { RootState } from '../../../stores/store';
import { leaveServer } from '../../../controllers/rivulet-main/ServerController';

export function LeaveServerDialog({ serverId, isCreator, onClose }: { serverId: number; isCreator: boolean; onClose: () => void }) {
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    const candidates = members.filter(member => member.parentGuildId === serverId && member.role !== 'creator');
    const [successor, setSuccessor] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function leave() {
        setBusy(true);
        setError('');
        try {
            await leaveServer(serverId, isCreator ? Number(successor) : undefined);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not leave server.');
        } finally { setBusy(false); }
    }
    return <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
        <DialogTitle>{isCreator ? 'Transfer Ownership and Leave' : 'Leave Server'}</DialogTitle>
        <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {isCreator ? <>
                <Typography sx={{ mb: 2 }}>Choose a successor owner. They will gain creator permissions when you leave.</Typography>
                {candidates.length ? <TextField select fullWidth label="Successor owner" value={successor} disabled={busy} onChange={event => setSuccessor(event.target.value)}>
                    {candidates.map(member => <MenuItem key={member.memberUserId} value={String(member.memberUserId)}>{member.memberName}</MenuItem>)}
                </TextField> : <Alert severity="info">Invite another member before leaving so you can select a successor owner.</Alert>}
            </> : <Typography>You can rejoin this server with an invite.</Typography>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} disabled={busy}>Cancel</Button>
            <Button color="error" disabled={busy || (isCreator && !candidates.some(member => String(member.memberUserId) === successor))} onClick={() => void leave()}>
                {isCreator ? 'Transfer and Leave' : 'Leave Server'}
            </Button>
        </DialogActions>
    </Dialog>;
}
