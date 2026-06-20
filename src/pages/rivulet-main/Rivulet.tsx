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
import { store } from '../../stores/store';
import { switchToServer } from '../../controllers/rivulet-main/ServerController';

function Rivulet() {
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
                height: '100vh',
                width: '100vw',
                backgroundColor: 'background.default',
            }}
        >
            <SpaceCreationModal/>
            <InviteReceivedModal/>
            {/* Server List */}
            <Box
                sx={{
                    height: '100%',
                    backgroundColor: 'background.main',
                    borderRight: '2px solid grey.500',
                }}
            >
            <ServerList />
            </Box>

            {/* Channel Sidebar */}
            <Box
                sx={{
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

            {/* Message List */}
           <Box
                sx={{
                    height: '100%',
                    backgroundColor: 'background.main',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <MessageList/>
           </Box>

            {/* Member List */}
           <Box
                sx={{
                    height: '100%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <MemberList/>
           </Box>
        </Box>
    );
}

export { Rivulet };