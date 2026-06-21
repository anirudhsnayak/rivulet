/**
 * @file Shared styled button component — used across login, settings, and modals.
 *
 * Wraps MUI's `Button` with custom theming from the app's palette extension
 * (`button.main` for the background colour). Accepts any MUI Button props
 * via the spread, plus a `name` prop used as the button label.
 *
 * @see {@link theme.ts} — the palette extension defining `button` colours
 */

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

/** Styled MUI Button using the custom `button.main` palette colour. */
const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.button?.main || theme.palette.primary.main,
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
    },
}));

/**
 * Shared button component with Rivulet theming.
 *
 * Renders a full-width contained button. Pass the label text via `name`
 * and an `onClick` handler for interaction.
 *
 * @param props.name - The button label text.
 * @param props.onClick - Click event handler.
 * @param props - Any additional MUI Button props are forwarded.
 */
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