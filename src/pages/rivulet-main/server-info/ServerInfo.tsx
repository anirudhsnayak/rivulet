import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { displayInviteCode } from '../../../controllers/rivulet-main/ServerController';

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
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.primary.dark,
    },
}));

export function ServerInfo() {
    const guilds = useSelector((state: RootState) => state.UserSlice.guilds);
    const currentGuildId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    const currentGuild = guilds.find((g) => g.guildId === currentGuildId);
    const serverName = currentGuild?.guildName ?? 'No Server';

    return (
        <ServerInfoContainer>
            <ServerName variant="body2">{serverName}</ServerName>
            <InviteButton onClick={displayInviteCode}>
                Invite People
            </InviteButton>
        </ServerInfoContainer>
    );
}
