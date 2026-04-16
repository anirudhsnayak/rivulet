import Box from '@mui/material/Box';
import { RivuletButton } from '../components/RivuletButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { RootState } from '../stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { SpaceCreationState } from '../models/global/SpaceCreationState';
import { setCreatingSpace } from '../stores/slices/RivuletSlice';
import { RivuletTextField } from '../components/RivuletTextField';
import { handleSpaceCreation } from '../controllers/rivulet-main/SpaceCreationController';
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

export function SpaceCreationModal() {
    const creatingSpace = useSelector(
         (state: RootState) => state.RivuletState.creatingSpace
    );
    const dispatch = useDispatch();
    const [spaceName, setSpaceName] = useState('');

    const handleCreateClick = async (guildId: number) => {
        const spaceParams = {
            guildId: guildId,
            spaceName: spaceName,
        };
        if (spaceName.trim()) {
            await handleSpaceCreation(creatingSpace, spaceParams, dispatch);
            setSpaceName('');
            dispatch(setCreatingSpace(SpaceCreationState.NotCreatingSpace));
        }
    };
    const spaceType = (creatingSpace === SpaceCreationState.CreatingServer ? "Server" : "Channel");
    const guildId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    return (
    <>
        <Modal open={creatingSpace != SpaceCreationState.NotCreatingSpace} 
               onClose={() => {
                    dispatch(setCreatingSpace(SpaceCreationState.NotCreatingSpace));
               }}>
        <Box sx={style}>
            <Typography sx={{ color: 'text.primary' }} variant="h6" component="h2">
            Create a New {spaceType}
            </Typography>

            {/* Server Name */}
            <RivuletTextField 
                label = {`${spaceType} Name`}
                sx={{ width: '100%' }} 
                value={spaceName}
                onChange={(e: any) => setSpaceName(e.target.value)}
            />

            {/* Box that contains the Create Server button, center contents and self*/}
            <Box sx={{ 
                marginTop: '1rem', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
             }}>
                <RivuletButton
                    name={`Create ${spaceType}`}
                    onClick={() => handleCreateClick(guildId)}
                />
            </Box>
        </Box>
        </Modal>
    </>
    );
}
