/**
 * @file Shared styled text field component — used across login, creation modals, and messages.
 *
 * Wraps MUI's `TextField` with a filled variant and custom theming from the
 * app's palette (`primary.lighter` background). Accepts any MUI TextField
 * props via the spread.
 *
 * @see {@link theme.ts} — the palette extension defining `primary.lighter`
 */

import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

/** Styled MUI TextField using `primary.lighter` as the background colour. */
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

/**
 * Shared text field component with Rivulet theming.
 *
 * Renders a full-width filled-variant MUI TextField. Pass the label text via
 * `label` and a change handler via `onChange`. Additional props (like `value`,
 * `type`, `onKeyPress`, `sx`) are forwarded.
 *
 * @param props.label - The input label displayed above the field.
 * @param props.onChange - Change event handler.
 * @param props - Any additional MUI TextField props are forwarded.
 */
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