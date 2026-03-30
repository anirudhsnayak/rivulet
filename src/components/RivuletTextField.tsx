import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.lighter || theme.palette.primary.light,
    '& .MuiInputLabel-root': {
        color: theme.palette.text.primary,
    },
    '& .MuiFilledInput-input': {
        color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.text.secondary,
    },
}));

export function RivuletTextField(props: any) {
    return (
        <StyledTextField
            fullWidth
            label={props.label}
            color='primary'
            variant="filled"
            margin="normal"
            {...props}
        />
    );
}