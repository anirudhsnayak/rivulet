/**
 * @file Server (guild) list — the leftmost toolbar column.
 *
 * Renders an icon for each guild the user belongs to, plus a "+" button
 * to create a new server. Clicking an icon switches to that server via
 * {@link switchToServer}.
 *
 * Uses uppercase initials derived from the guild name as fallback icons.
 *
 * @see {@link switchToServer} — controller for server switching
 * @see {@link ServerInfo} — server name + invite area
 * @see {@link docs/architecture.md#main-app-layout-css-grid} — grid layout docs
 */

import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../stores/store';
import { styled } from '@mui/material/styles';
import currentTheme from '../../../theme/theme';
import { setCreatingSpace } from '../../../stores/slices/RivuletSlice';
import { SpaceCreationState } from '../../../models/global/SpaceCreationState';
import { switchToServer } from '../../../controllers/rivulet-main/ServerController';

/**
 * Extracts uppercase initials from a channel or server name.
 * Falls back to `"?"` for empty or undefined names.
 *
 * @param channelName - The name to derive initials from.
 * @returns Uppercase initial letters joined together.
 *
 * @example
 * noIconRenderText("Rivulet HQ") // "RH"
 * noIconRenderText("")            // "?"
 */
function noIconRenderText(channelName: string): string {
    if(channelName == undefined || channelName.length == 0) return '?';
    return channelName.split(' ').map(word => word[0]).join('').toUpperCase();
}

/**
 * Styled server icon square with optional selection border.
 *
 * The `selected` prop controls whether a highlight border is drawn,
 * matching the currently active guild.
 */
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


/**
 * Server (guild) list — the leftmost toolbar column.
 *
 * Displays clickable icons for each guild. The currently selected guild
 * is visually highlighted. An extra "+" icon opens the server creation modal.
 */
export function ServerList() {
    const guilds = useSelector((state: RootState) => state.UserSlice.guilds);
    const dispatch = useDispatch();

    const selectedGuild = useSelector((state: RootState) => state.UserSlice.currentGuildId);

    return (
        <div>
            {guilds.map((guild, index) => (
            <ServerIcon
                key={index}
                selected={selectedGuild === guild.guildId}
                onClick={() => switchToServer(guild.guildId)}
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