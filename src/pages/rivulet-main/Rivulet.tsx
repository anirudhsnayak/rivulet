/**
 * @file Main application layout — the primary workspace after login.
 *
 * Rendered at `/app`. Assembles a 4-column CSS Grid layout containing
 * the server list, channel sidebar, message area, member list, and
 * user info panel. Also hosts the overlay modals for space creation
 * and invite handling.
 *
 * On mount, hydrates the user model from the API and auto-selects the
 * first guild if one is available.
 *
 * @see {@link docs/architecture.md#main-app-layout-css-grid} — grid layout docs
 */

import Box from '@mui/material/Box';
import { ServerList } from './servers/ServerList';
import { ChannelList } from './channels/ChannelList';
import { ServerInfo } from './server-info/ServerInfo';
import { MessageList } from './messages/MessageList';
import { useEffect } from 'react';
import { updateUserModel } from '../../api/UserModelAPI';
import { SpaceCreationModal } from './space-creation/SpaceCreationModal';
import { InviteReceivedModal } from './space-creation/InviteReceivedModal';
import { MemberList } from './members/MemberList';
import { UserInfo } from './user-info/UserInfo';
import { store } from '../../stores/store';
import { switchToServer } from '../../controllers/rivulet-main/ServerController';
import { usePresenceStream } from '../../hooks/usePresenceStream';

/**
 * Main application layout — the primary workspace after login.
 *
 * CSS Grid structure (4 columns × 1 row, with overlays):
 * ```
 * +--------+----------+------------------+----------+
 * | Server | Channel  |   MessageList    |  Member  |
 * | List   | Sidebar  |   (1fr)          |  List    |
 * | (4rem) | (10rem)  |                  | (10rem)  |
 * +--------+----------+------------------+----------+
 * |              UserInfo (col 1-2, self-end)       |
 * +--------+----------+------------------+----------+
 * ```
 *
 * Overlays (col 1 / -1): {@link SpaceCreationModal}, {@link InviteReceivedModal}
 */
function Rivulet() {
    usePresenceStream();
    useEffect(() => {
        updateUserModel().then(() => {
            const guildId = store.getState().UserSlice.currentGuildId;
            if (guildId !== -1) {
                switchToServer(guildId);
            }
        });
    }, []);
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '4rem 10rem 1fr 10rem',
                gridTemplateRows: '1fr',
                height: '100vh',
                width: '100vw',
                backgroundColor: 'background.default',
            }}
        >
            <Box sx={{ gridColumn: '1 / -1' }}><SpaceCreationModal/></Box>
            <Box sx={{ gridColumn: '1 / -1' }}><InviteReceivedModal/></Box>
            {/* Server List (row 1, col 1) */}
            <Box
                sx={{
                    gridRow: '1 / 2',
                    gridColumn: '1 / 2',
                    height: '100%',
                    backgroundColor: 'background.main',
                    borderRight: '2px solid grey.500',
                }}
            >
            <ServerList />
            </Box>

            {/* Channel Sidebar (row 1, col 2) */}
            <Box
                sx={{
                    gridRow: '1 / 2',
                    gridColumn: '2 / 3',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    overflow: 'hidden',
                }}
            >
                <ServerInfo />
                <ChannelList />
            </Box>

            {/* Message List (spans both rows, col 3) */}
           <Box
                sx={{
                    gridRow: '1 / -1',
                    gridColumn: '3 / 4',
                    height: '100%',
                    backgroundColor: 'background.main',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <MessageList/>
           </Box>

            {/* Member List (spans both rows, col 4) */}
           <Box
                sx={{
                    gridRow: '1 / -1',
                    gridColumn: '4 / 5',
                    height: '100%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                <MemberList/>
           </Box>

            {/* User Info (overlays bottom of col 1-2) */}
            <Box
                sx={{
                    gridRow: '1 / 2',
                    gridColumn: '1 / 3',
                    alignSelf: 'end',
                }}>
                <UserInfo />
            </Box>
        </Box>
    );
}

export { Rivulet };
