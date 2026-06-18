import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.button?.main || theme.palette.primary.main,
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
    },
}));

export function RivuletButton(props: any) {
    return (
        <StyledButton
            fullWidth
            onClick={props.onClick}
            variant="contained"
        >
            {props.name}
        </StyledButton>
    );
}