import Box from '@mui/material/Box';
import { ServerList } from './ServerList';
import { ChannelList } from './ChannelList';
import { MessageList } from './MessageList';
import { LoadingPage } from './LoadingPage';
import { useSelector } from 'react-redux';
import type { RootState } from '../core/stores/store';
import { useEffect } from 'react';
import { updateUserModel } from '../core/server-interface/UserModelLoader';



function Rivulet() {
    // useEffect(()=>{
    //     updateUserModel()
    // });
    // const appLoaded = useSelector((state: RootState) => state.RivuletState.appLoaded);
    // if (!appLoaded) return <LoadingPage />;
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
            <Box
                sx={{
                    width: '5rem',
                    height: '100%',
                    backgroundColor: 'red',
                    borderRight: '2px solid grey.500',
                }}
            >
            <ServerList />
            </Box>
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
           <Box
                sx={{
                    flexGrow: 1, 
                    height: '100%',
                    backgroundColor: 'background.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <MessageList/>
           </Box>
           <Box
                sx={{
                    width: '15rem',
                    height: '100%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
            
           </Box>
        </Box>
    );
}

export { Rivulet };