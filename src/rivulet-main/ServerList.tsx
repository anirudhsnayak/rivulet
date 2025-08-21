import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { addGuild, removeGuild } from '../core/stores/UserModel';

export function ServerList() {
    const guilds = useSelector((state: RootState) => state.UserModel.guilds);
    const dispatch = useDispatch()

    return (
        <div>
            <div>
            <div>
                <button
                onClick={() => dispatch(addGuild())}
                >
                Add Server
                </button>
                <button
                onClick={() => dispatch(removeGuild())}
                >
                Remove Server
                </button>
            </div>
            </div>
            {Array.from({ length: guilds.length }, (_, index) => (
                <Box
                    key={index}
                    sx={{
                        borderRadius: '30%',
                        width: 'auto',
                        margin: '0.5rem 0.5rem',
                        aspectRatio: '1',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.primary',
                    }}
                >
                    S {index + 1}
                </Box>
            ))}
        </div>
    );
    
}