/**
 * @file Member list — the rightmost column showing server members.
 *
 * Displays all members of the currently selected server with a count
 * header. Rendered in grid column 4 of the main layout.
 *
 * @see {@link docs/architecture.md#main-app-layout-css-grid} — grid layout docs
 */

import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

/** A single member row with optional selection highlight. */
const MemberEntry = styled(Box)<{ selected?: boolean }>(({ selected, theme }) => ({
    width: '100%',
    margin: '0.1rem 0.5rem',
    padding: '0.1rem 0.75rem',
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

/** "Members — {count}" header row. */
const MemberListHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    display: 'flex',
    flexDirection: 'row' as 'row',
    color: theme.palette.text.disabled,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flexShrink: 0,
}));

/**
 * Member list — the rightmost panel showing all members of the currently
 * selected server. Displays each member's name and a total count header.
 */
export function MemberList() {
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    return (
        <>
            <MemberListHeader>
                <span>Members &ndash; {members.length}</span>
            </MemberListHeader>
            {Array.from({ length: members.length }, (_, index) => (
                <MemberEntry key={index}>
                    {members[index].memberName}
                </MemberEntry>
            ))}
        </>

    );
}