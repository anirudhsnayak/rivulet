import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../core/stores/store';
import { addGuild, removeGuild } from '../core/stores/UserModel';
import { styled } from '@mui/material/styles';
import currentTheme from '../theme/theme';
import { setCreatingServer } from '../core/stores/RivuletState';

function noIconRenderText(channelName: string): string {
    return channelName.split(' ').map(word => word[0]).join('').toUpperCase();
}

const ServerIcon = styled(Box)({
    borderRadius: '30%',
    width: 'auto',
    margin: '0.25rem',
    aspectRatio: '1',
    backgroundColor: currentTheme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.primary',
    textAlign: 'center',
    fontSize: '1.25rem',
    '&:hover': {
        cursor: 'pointer',
    },
});


export function ServerList() {
    const guilds = useSelector((state: RootState) => state.UserModel.guilds);
    const dispatch = useDispatch()

    return (
        <div>
            {guilds.map((guild, index) => (
            <ServerIcon key={index}>
                {noIconRenderText(guild.guildName)}
            </ServerIcon>
            ))}
            <ServerIcon
                onClick={() => dispatch(setCreatingServer(true))}
            >+</ServerIcon>
        </div>
    );
    
}