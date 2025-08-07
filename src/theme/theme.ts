import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        button: {
            main: string;
        };
        tabs: {
            main: string;
            tabTextSelected?: string;
        };
    }
    interface PaletteOptions {
        button?: {
            main: string;
        };
        tabs: {
            main: string;
            tabTextSelected?: string;
        };
    }
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark', 
        primary: {
            main: '#0d1b2a',
            contrastText: '#688896',
        },
        text: {
            primary: '#ffffff',
            secondary: '#0d1b2a',
        },
        background: {
            default: '#1b2631',
        },
        button: {
            main: '#37511fff',
        },
        tabs: {
            main: '#416520ff',
            tabTextSelected: '#44c7d0ff',
        }
    },
});

export default darkTheme;