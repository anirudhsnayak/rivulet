import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'; 

const MemberEntry = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
    width: 'auto',
    margin: '0.5rem 0.5rem',
    backgroundColor: 'primary.main',
    border: "1px solid",
    borderColor: selected ? 'red' : 'primary.light',
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'center',
    color: 'text.primary',
    textAlign: 'center',
    '&:hover': {
        cursor: 'pointer',
    },
}));

export function MemberList() {
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    return (
        <div>
            {Array.from({ length: members.length }, (_, index) => (
                <MemberEntry key={index}>
                    {members[index].memberName}
                </MemberEntry>
            ))}
        </div>

    );
}