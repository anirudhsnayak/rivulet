/**
 * @file Space creation modal — form for creating a new server or channel.
 *
 * A single modal component that renders different content based on the
 * current {@link SpaceCreationState} value in Redux. Displays a text
 * input and a submit button, delegating creation logic to
 * {@link handleSpaceCreation}.
 *
 * @see {@link SpaceCreationState} — enum controlling which modal is shown
 * @see {@link handleSpaceCreation} — controller for the creation logic
 * @see {@link docs/architecture.md#space-creation-flow} — creation flow docs
 */

import Box from '@mui/material/Box';
import { RivuletButton } from '../../../components/RivuletButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { RootState } from '../../../stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { SpaceCreationState } from '../../../models/global/SpaceCreationState';
import { setCreatingSpace } from '../../../stores/slices/RivuletSlice';
import { RivuletTextField } from '../../../components/RivuletTextField';
import { handleSpaceCreation } from '../../../controllers/rivulet-main/SpaceCreationController';
import { useState } from 'react';
import Alert from '@mui/material/Alert';

/** Centered modal card styling with generous padding. */
const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: "1px solid",
    borderColor: 'primary.lighter',
    borderRadius: '8px',
    backgroundColor: 'primary.main',
    padding: '4rem',
}

/**
 * Space creation modal — shown when creating a server or a channel.
 *
 * Controlled by {@link RivuletState.creatingSpace}. The modal adapts its
 * title ("Create a New Server" / "Create a New Channel") and button label
 * based on which creation state is active. Closes on backdrop click or
 * after successful creation.
 */
export function SpaceCreationModal() {
    const creatingSpace = useSelector(
         (state: RootState) => state.RivuletState.creatingSpace
    );
    const dispatch = useDispatch();
    const [spaceName, setSpaceName] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const handleCreateClick = async (guildId: number) => {
        const spaceParams = {
            guildId: guildId,
            spaceName: spaceName,
        };
        if (spaceName.trim() && !busy) {
            setBusy(true);
            setError('');
            try {
                await handleSpaceCreation(creatingSpace, spaceParams, dispatch);
                setSpaceName('');
                dispatch(setCreatingSpace(SpaceCreationState.NotCreatingSpace));
            } catch (err) { setError(err instanceof Error ? err.message : 'Could not create space.'); }
            finally { setBusy(false); }
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

            {error && <Alert severity="error">{error}</Alert>}
            {/* Server Name */}
            <RivuletTextField
                label = {`${spaceType} Name`}
                sx={{ width: '100%' }}
                value={spaceName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpaceName(e.target.value)}
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
