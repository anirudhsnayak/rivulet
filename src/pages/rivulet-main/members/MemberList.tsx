import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'; 

const MemberEntry = styled(Box)<{ selected?: boolean }>(({ selected, theme }) => ({
    width: '100%',
    margin: '0.25rem 0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: selected ? '6px' : '0px',
    backgroundColor: selected ? theme.palette.primary.lighter : 'transparent',
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'flex-start',
    color: selected ? 'text.primary' : theme.palette.text.disabled,
    textAlign: 'center',
    '&:hover': {
        cursor: 'default',
        backgroundColor: selected ? theme.palette.primary.lighter : theme.palette.action.hover,
    },
}));

export function MemberList() {
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    return (
        <>
            {Array.from({ length: members.length }, (_, index) => (
                <MemberEntry key={index}>
                    {members[index].memberName}
                </MemberEntry>
            ))}
        </>

    );
}