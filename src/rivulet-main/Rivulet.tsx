import Box from '@mui/material/Box';
import { ServerList } from './ServerList';
import { ChannelList } from './ChannelList';

function Rivulet() {
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
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                }}
            >
            <ChannelList />
        </Box>   
        </Box>
    );
}

export { Rivulet };