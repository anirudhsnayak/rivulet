import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Check from '@mui/icons-material/Check';
import type { RootState } from '../../../stores/store';
import { getInviteCode } from '../../../api/ServerAPI';

const URL_PREFIX = `${window.location.origin}/invite/`;
const CODE_PLACEHOLDER = ' '.repeat(8);

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

const inviteLinkBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    width: '100%',
    boxSizing: 'border-box' as 'border-box',
};

const inviteLinkText = {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as 'nowrap',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: 'text.primary',
};

interface InviteModalProps {
    open: boolean;
    onClose: () => void;
}

export function InviteModal({ open, onClose }: InviteModalProps) {
    const serverId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    const [inviteUrl, setInviteUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open || serverId === -1) return;

        let cancelled = false;
        setLoading(true);
        setError('');
        setInviteUrl('');
        setCopied(false);

        getInviteCode(serverId).then((code) => {
            if (cancelled) return;
            if (!code) {
                setError('Failed to generate invite code.');
                return;
            }
            setInviteUrl(`${URL_PREFIX}${code}`);
            setLoading(false);
        }).catch((err) => {
            if (cancelled) return;
            setError(err instanceof Error ? err.message : 'Failed to load invite link.');
            setLoading(false);
        });

        return () => { cancelled = true; };
    }, [open, serverId]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
        } catch {
            const selection = window.getSelection();
            const range = document.createRange();
            const textNode = document.querySelector('[data-invite-text]');
            if (textNode) {
                range.selectNodeContents(textNode);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }
    }, [inviteUrl]);

    const showPlaceholder = loading && !error;
    const displayText = showPlaceholder ? `${URL_PREFIX}${CODE_PLACEHOLDER}` : inviteUrl;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ color: 'text.primary' }}>
                    Invite People
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Share this link to invite people to your server
                </Typography>

                {error ? (
                    <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
                        {error}
                    </Typography>
                ) : (
                    <Box sx={inviteLinkBox}>
                        <Typography
                            sx={{
                                ...inviteLinkText,
                                opacity: showPlaceholder ? 0.5 : 1,
                                userSelect: showPlaceholder ? 'none' : 'auto',
                            }}
                            data-invite-text
                        >
                            {displayText}
                        </Typography>
                        <IconButton
                            onClick={handleCopy}
                            size="small"
                            disabled={!inviteUrl}
                            sx={{ color: copied ? 'success.light' : 'text.secondary' }}
                        >
                            {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                        </IconButton>
                    </Box>
                )}

                {copied && (
                    <Typography variant="caption" sx={{ color: 'success.light' }}>
                        Copied to clipboard!
                    </Typography>
                )}
            </Box>
        </Modal>
    );
}
