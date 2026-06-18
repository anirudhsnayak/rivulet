import Box from '@mui/material/Box';
import { ServerList } from './servers/ServerList';
import { ChannelList } from './channels/ChannelList';
import { MessageList } from './messages/MessageList';
import { useEffect } from 'react';
import { updateUserModel } from '../../api/UserModelAPI';
import { SpaceCreationModal } from '../../space-creation/SpaceCreationModal';
import { MemberList } from './members/MemberList';
import { processPendingInvites } from '../../controllers/rivulet-main/UserController';

function Rivulet() {
    useEffect(()=>{
        updateUserModel();
        processPendingInvites();
    });
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                width: '100vw', // Full viewport width
                backgroundColor: 'background.default', // Use theme's default background color
            }} 
        > 
            <SpaceCreationModal/>
            {/* Server List */}
            <Box
                sx={{
                    width: '4rem',
                    height: '100%',
                    backgroundColor: 'background.main',
                    borderRight: '2px solid grey.500',
                }}
            >
            <ServerList />
            </Box>

            {/* Channel List */}
            <Box
                sx={{
                    height: '100%',
                    width: '20rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                }}
            >
            <ChannelList />
           </Box>   

            {/* Message List */}
           <Box
                sx={{
                    flexGrow: 1, 
                    height: '100%',
                    backgroundColor: 'background.main',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <MessageList/>
           </Box>

            {/* Member List */}
           <Box
                sx={{
                    width: '15rem',
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