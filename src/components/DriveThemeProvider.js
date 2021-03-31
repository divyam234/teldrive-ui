import { useContext, useMemo } from "react";
import { ThemeModeContext, ThemeSchemeContext } from "@bhunter179/react-material-you-theme";
import { CacheProvider } from '@emotion/react'
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { getDesignTokens, getThemedComponents } from '@bhunter179/react-material-you-theme';
import { DEFAULT_M3_THEME_SCHEME } from '@bhunter179/react-material-you-theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { deepmerge } from "@mui/utils";

// const overrides = (theme) => ({
//     conponents: {
//         MuiCssBaseline: {
//             styleOverrides: {
//                 body: {
//                     "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
//                         width: 8,
//                     },
//                     '*::-webkit-scrollbar-track': {
//                         background: theme.palette.background.default,
//                         borderRadius: 8,
//                     },
//                     "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
//                         borderRadius: 8,
//                         backgroundColor: theme.palette.primary.main,
//                         minHeight: 24,
//                         borderWidth: '1px 1px 1px 6px',
//                     },
//                 },
//             },
//         }
//     }
// })

const lightTheme = {
    colors: {
        debugRed: '#fabdbd',
        debugBlue: '#bdd8fa',
        debugGreen: '#d2fabd',
        debugPurple: '#d2bdfa',
        debugYellow: '#fae9bd',

        textActive: '#09f',
    },

    fontSizes: {
        rootPrimary: 15,
    },

    margins: {
        rootLayoutMargin: 8,
    },

    root: {
        borderRadius: 4,
        borderStyle: 'solid 1px',
        height: '100%',
    },

    toolbar: {
        size: 30,
        lineHeight: '30px',
        buttonPadding: 8,
        fontSize: 15,
        buttonRadius: 4,
    },

    dnd: {
        canDropColor: 'green',
        cannotDropColor: 'red',
        canDropMask: 'rgba(180, 235, 180, 0.75)',
        cannotDropMask: 'rgba(235, 180, 180, 0.75)',
        fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
        fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
        fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
        fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)',
    },

    dragLayer: {
        border: 'solid 2px #09f',
        padding: '7px 10px',
        borderRadius: 2,
    },

    fileList: {
        desktopGridGutter: 8,
        mobileGridGutter: 5,
    },

    gridFileEntry: {
        childrenCountSize: '1.6em',
        iconColorFocused: '#000',
        iconSize: '2.4em',
        iconColor: '#fff',
        borderRadius: 5,
        fontSize: 14,

        fileColorTint: 'rgba(255, 255, 255, 0.4)',
        folderBackColorTint: 'rgba(255, 255, 255, 0.1)',
        folderFrontColorTint: 'rgba(255, 255, 255, 0.4)',
    },

    listFileEntry: {
        propertyFontSize: 16,
        iconFontSize: '1.1em',
        iconBorderRadius: 5,
        fontSize: 16,
    },
};

const darkThemeOverride = {
    gridFileEntry: {
        fileColorTint: 'rgba(50, 50, 50, 0.4)',
        folderBackColorTint: 'rgba(50, 50, 50, 0.4)',
        folderFrontColorTint: 'rgba(50, 50, 50, 0.15)',
    },
};
const mobileThemeOverride = {
    fontSizes: {
        rootPrimary: 13,
    },
    margins: {
        rootLayoutMargin: 4,
    },
    toolbar: {
        size: 28,
        lineHeight: '28px',
        fontSize: 13,
    },
    gridFileEntry: {
        fontSize: 13,
    },
    listFileEntry: {
        propertyFontSize: 12,
        iconFontSize: '1em',
        fontSize: 13,
    },
};
const useIsMobileBreakpoint = () => {
    return useMediaQuery('(max-width:480px)');
};

const useChonkyTheme = (themeMode = "light", themeScheme = DEFAULT_M3_THEME_SCHEME, themeOverride) => {

    const designTokens = getDesignTokens(themeMode, themeScheme[themeMode], themeScheme.tones);
    let newM3Theme = createTheme(designTokens);
    newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));

    const isMobileBreakpoint = useIsMobileBreakpoint();

    const combinedTheme = deepmerge(
        newM3Theme,
        deepmerge(deepmerge(lightTheme, themeMode == 'dark' ? darkThemeOverride : {}), themeOverride || {}),
    );

    const theme = useMemo(() => isMobileBreakpoint ? deepmerge(combinedTheme, mobileThemeOverride) : combinedTheme
        , [isMobileBreakpoint, combinedTheme])

    return theme

}
const DriveThemeProvider = ({ children, emotionCache }) => {
    const { themeMode } = useContext(ThemeModeContext);
    const { themeScheme } = useContext(ThemeSchemeContext);
    const theme = useChonkyTheme(themeMode, themeScheme, {})

    return (
        <CacheProvider value={emotionCache}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </MuiThemeProvider>
        </CacheProvider>
    )

}

export default DriveThemeProvider