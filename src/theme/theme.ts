/**
 * @file MUI dark theme configuration with custom palette extensions.
 *
 * Defines the application-wide dark theme via MUI's `createTheme`, including
 * custom palette slots for `button` and `tabs` colours and an additional
 * `lighter` shade on the `primary` colour.
 *
 * The custom palette types are declared via module augmentation on
 * `@mui/material/styles` so they are available throughout the codebase.
 *
 * @see {@link RivuletButton} — uses `button.main` for background
 * @see {@link RivuletTextField} — uses `primary.lighter` for background
 * @see {@link ServerInfo} — uses `tabs.main` for accent borders
 */

import { createTheme } from '@mui/material/styles';

/**
 * Augment MUI's palette types with Rivulet's custom colour slots.
 *
 * - `button` — controls the shared button background and hover text colour.
 * - `tabs` — controls the tab bar background and selected tab text colour.
 * - `primary.lighter` — used as the background for text fields and selected rows.
 */
declare module '@mui/material/styles' {
    interface Palette {
        button: {
            main: string;
            hoverTextColor: string;
        };
        tabs: {
            main: string;
            tabTextSelected?: string;
        };
    }
    interface PaletteOptions {
        button?: {
            main: string;
            hoverTextColor: string;
        };
        tabs: {
            main: string;
            tabTextSelected?: string;
        };
    }
    interface PaletteColor { //primary
        lighter?: string;
    }
    interface SimplePaletteColorOptions {
        lighter?: string;
    }

}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0d1b2a',
            lighter: '#688896',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b8c4',
        },
        background: {
            default: '#1b2631',
        },
        button: {
            main: '#37511fff',
            hoverTextColor: '#44c7d0ff',
        },
        tabs: {
            main: '#416520ff',
            tabTextSelected: '#44c7d0ff',
        }
    },
});

let currentTheme = darkTheme;

export default currentTheme;