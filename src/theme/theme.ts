import { createTheme } from '@mui/material/styles';

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