import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../stores/store';
import { setCurrentGuildById } from '../../../stores/slices/UserSlice';
import { styled } from '@mui/material/styles';
import currentTheme from '../../../theme/theme';
import { setCreatingSpace } from '../../../stores/slices/RivuletSlice';
import { SpaceCreationState } from '../../../models/global/SpaceCreationState';
import { reloadChannels } from '../../../api/ChannelAPI';
import { reloadMembers } from '../../../api/MemberAPI';

function noIconRenderText(channelName: string): string {
    if(channelName == undefined || channelName.length == 0) return '?';
    return channelName.split(' ').map(word => word[0]).join('').toUpperCase();
}

const ServerIcon = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
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
    border: selected ? `2px solid ${currentTheme.palette.text.primary}` : 'none',
    '&:hover': {
        cursor: 'pointer',
    },
}));


export function ServerList() {
    const guilds = useSelector((state: RootState) => state.UserModel.guilds);
    const dispatch = useDispatch();

    const selectedGuild = useSelector((state: RootState) => state.UserModel.currentGuildId);

    return (
        <div>
            {guilds.map((guild, index) => (
            <ServerIcon 
                key={index}
                selected={selectedGuild === guild.guildId}
                onClick={() => {
                        dispatch(setCurrentGuildById(guild.guildId))
                        reloadChannels();
                        reloadMembers();
                    }
                }
            >
                {noIconRenderText(guild.guildName)}
            </ServerIcon>
            ))}
            <ServerIcon
                onClick={() => dispatch(setCreatingSpace(SpaceCreationState.CreatingServer))}
            >+</ServerIcon>
        </div>
    );
    
}