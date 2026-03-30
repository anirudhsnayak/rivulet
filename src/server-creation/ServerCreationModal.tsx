import Box from '@mui/material/Box';
import { RivuletButton } from '../components/RivuletButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { RootState } from '../core/stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatingServer } from '../core/stores/RivuletState';
import { RivuletTextField } from '../components/RivuletTextField';
import { handleServerCreation } from './ServerCreationHandler';
import { useState } from 'react';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: "1px solid",
    borderColor: 'primary.lighter',
    borderRadius: '8px',
    backgroundColor: 'primary.main',
    padding: '4rem',
}

export function ServerCreationModal() {
    const creatingServer = useSelector(
         (state: RootState) => state.RivuletState.creatingServer
    );
    const dispatch = useDispatch();
    const [serverName, setServerName] = useState('');

    const handleCreateClick = async () => {
        if (serverName.trim()) {
            await handleServerCreation(serverName, dispatch);
            setServerName('');
            dispatch(setCreatingServer(false));
        }
    };

    return (
    <>
        <Modal open={creatingServer} onClose={() => dispatch(setCreatingServer(false))}>
        <Box sx={style}>
            <Typography sx={{ color: 'text.primary' }} variant="h6" component="h2">
            Create a New Server
            </Typography>

            {/* Server Name */}
            <RivuletTextField 
                label="Server Name" 
                sx={{ width: '100%' }} 
                value={serverName}
                onChange={(e: any) => setServerName(e.target.value)}
            />
            {/* Box that contains the Create Server button, center contents and self*/}
            <Box sx={{ 
                marginTop: '1rem', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
             }}>
                <RivuletButton
                    name="Create Server"
                    onClick={handleCreateClick}
                />
            </Box>
        </Box>
        </Modal>
    </>
    );
}
