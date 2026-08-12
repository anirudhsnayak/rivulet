import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Switch, TextField, Typography } from '@mui/material';
import type { RootState } from '../../../stores/store';
import { setMemberRole, transferOwnership } from '../../../api/ServerManagementAPI';
import { reloadMembers } from '../../../api/MemberAPI';
import { updateUserModel } from '../../../api/UserModelAPI';

export function ServerSettingsDialog({ serverId, onClose }: { serverId: number; onClose: () => void }) {
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    const serverName = useSelector((state: RootState) => state.UserSlice.guilds.find(server => server.guildId === serverId)?.guildName);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [successorId, setSuccessorId] = useState('');
    const [confirmTransfer, setConfirmTransfer] = useState(false);
    const candidates = members.filter(member => member.parentGuildId === serverId && member.role !== 'creator');
    const successor = candidates.find(member => String(member.memberUserId) === successorId);

    async function handleTransfer() {
        if (!successor) return;
        setBusy(true);
        setError('');
        try {
            await transferOwnership(serverId, successor.memberUserId);
            await updateUserModel();
            onClose();
        } catch (err) {
            setConfirmTransfer(false);
            setError(err instanceof Error ? err.message : 'Could not transfer ownership.');
        } finally { setBusy(false); }
    }

    async function changeRole(userId: number, admin: boolean) {
        setBusy(true);
        setError('');
        try {
            await setMemberRole(serverId, userId, admin ? 'admin' : 'member');
            await reloadMembers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not update admin.');
        } finally { setBusy(false); }
    }

    return <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="xs"
        aria-labelledby="server-settings-title"
        slotProps={{ paper: { sx: {
            bgcolor: 'primary.main', backgroundImage: 'none',
            border: '1px solid', borderColor: 'primary.lighter', borderRadius: '8px',
        } } }}>
        <DialogTitle id="server-settings-title" sx={{ px: 3, pt: 3, pb: 0.5, fontSize: '1.1rem', fontWeight: 700 }}>
            Server Settings
        </DialogTitle>
        <Typography variant="body2" color="text.secondary" sx={{ px: 3, mb: 3, overflowWrap: 'anywhere' }}>
            {serverName}
        </Typography>
        <DialogContent sx={{ px: 3, py: 0 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>
                Member permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                Admins can manage channels and kick users.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '6px', overflow: 'hidden' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 52px', alignItems: 'center', gap: 2, px: 2, py: 1,
                    borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Member</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textAlign: 'center' }}>Admin</Typography>
                </Box>
                {members.filter(member => member.parentGuildId === serverId).map(member => <Box key={member.memberUserId}
                    sx={{ display: 'grid', gridTemplateColumns: '1fr 52px', alignItems: 'center', gap: 2, px: 2, py: 1.25,
                        '& + &': { borderTop: '1px solid', borderColor: 'divider' } }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{member.memberName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {member.role === 'creator' ? 'Creator' : member.role === 'admin' ? 'Admin' : 'Member'}
                        </Typography>
                    </Box>
                    {member.role === 'creator' ?
                        <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '4px', px: 1, py: 0.25 }}>
                            Owner
                        </Typography> :
                        <Switch size="small" checked={member.role === 'admin'} disabled={busy}
                            sx={{ justifySelf: 'center', '& .MuiSwitch-switchBase.Mui-checked': { color: 'text.primary' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'tabs.main', opacity: 1 } }}
                            onChange={(_, checked) => void changeRole(member.memberUserId, checked)}
                            inputProps={{ 'aria-label': `Admin permissions for ${member.memberName}` }} />}
                </Box>)}
            </Box>
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Transfer ownership
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    Choose a new owner. You will stay in this server as an admin.
                </Typography>
                {candidates.length ? <>
                    <TextField select fullWidth size="small" label="New owner" value={successorId} disabled={busy}
                        onChange={event => { setSuccessorId(event.target.value); setConfirmTransfer(false); }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } }}>
                        {candidates.map(member => <MenuItem key={member.memberUserId} value={String(member.memberUserId)}>{member.memberName}</MenuItem>)}
                    </TextField>
                    {confirmTransfer ? <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Make {successor?.memberName} the owner? Only they will be able to manage admins and transfer ownership.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button disabled={busy} onClick={() => setConfirmTransfer(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
                            <Button disabled={busy || !successor} onClick={() => void handleTransfer()} color="error" sx={{ textTransform: 'none' }}>Confirm Transfer</Button>
                        </Box>
                    </Box> : <Button disabled={busy || !successor} onClick={() => setConfirmTransfer(true)}
                        sx={{ mt: 1, color: 'text.primary', textTransform: 'none' }}>Transfer Ownership</Button>}
                </> : <Typography variant="body2" color="text.secondary">Invite another member to transfer ownership.</Typography>}
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" role="status">{busy ? 'Saving changes…' : 'Changes save automatically'}</Typography>
            <Button variant="contained" disableElevation disabled={busy} onClick={onClose}
                sx={{ bgcolor: 'button.main', color: 'text.primary', textTransform: 'none', px: 2.5,
                    '&:hover': { bgcolor: 'primary.light' } }}>Done</Button>
        </DialogActions>
    </Dialog>;
}
