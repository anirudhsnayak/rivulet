import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { InviteModal } from './InviteModal';

const ServerInfoContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 0.5rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
}));

const ServerName = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: '0.9rem',
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}));

const InviteButton = styled('button')(({ theme }) => ({
    width: '100%',
    padding: '0.25rem 0.5rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.primary.dark,
    },
    '&:focus': {
        outline: 'none',
    },
}));

export function ServerInfo() {
    const guilds = useSelector((state: RootState) => state.UserSlice.guilds);
    const currentGuildId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    const currentGuild = guilds.find((g) => g.guildId === currentGuildId);
    const serverName = currentGuild?.guildName ?? 'No Server';
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    return (
        <ServerInfoContainer>
            <ServerName variant="body2">{serverName}</ServerName>
            <InviteButton onClick={() => setInviteModalOpen(true)}>
                Invite People
                <PersonAdd sx={{ fontSize: '0.9rem' }} />
            </InviteButton>
            <InviteModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        </ServerInfoContainer>
    );
}
