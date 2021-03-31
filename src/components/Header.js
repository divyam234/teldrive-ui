import React, { useContext, useState, useCallback, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel';
import { ThemeModeContext, ThemeSchemeContext } from "@bhunter179/react-material-you-theme";
import DarkIcon from '@mui/icons-material/DarkModeOutlined';
import LightIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/MenuTwoTone';
import { useTheme } from '@mui/material/styles';
import ColorIcon from '@mui/icons-material/ColorLensOutlined';
import debounce from "lodash.debounce";
import { useRouter } from 'next/router';
import { Tooltip, Grid, Box } from "@mui/material";
import RestartIcon from '@mui/icons-material/RefreshOutlined';
import AccountMenu from './AccountMenu';
import { useSession } from '@/hooks/useAuth';
import { allowedPaths } from '@/utils/common';


const PREFIX = 'AppBar';

const classes = {
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`,
};

const StyledAppBar = styled(AppBar)((
  {
    theme
  }
) => ({
  [`& .${classes.search}`]: {
    position: 'relative',
    height: '48px',
    display: 'flex',
    borderRadius: 6 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
    width: '100%',
    maxWidth: '720px',
    color: theme.palette.text.primary,
  },

  [`& .${classes.searchIcon}`]: {
    padding: theme.spacing(1.25),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },

  [`& .${classes.inputRoot}`]: {
    color: theme.palette.text.primary,
    width: '90%'
  },

  [`& .${classes.inputInput}`]: {
    padding: theme.spacing(1.25),
    transition: theme.transitions.create('width'),
    color: theme.palette.text.primary,
    width: '100%',
    fontSize: '0.8em',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1em',
    },
  },
}));

export default function Header({ onDrawerToggle }) {

  const [query, setQuery] = useState('')

  const theme = useTheme();

  const { palette } = theme

  const router = useRouter();

  const { path } = router.query

  const { asPath, pathname } = router

  const [session, loading] = useSession();

  const { toggleThemeMode, resetThemeMode } = useContext(ThemeModeContext);

  const { generateThemeScheme, resetThemeScheme } = useContext(ThemeSchemeContext);

  const changeThemeScheme = useCallback(() => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    generateThemeScheme(randomColor);
  }, [generateThemeScheme]);

  const reset = useCallback(() => {
    resetThemeMode();
    resetThemeScheme();
  }, [resetThemeMode, resetThemeScheme]);

  const onSearchFocus = useCallback(() => {
    if (!asPath.includes('search'))
      router.push(`/search`)
  }, [asPath, router])

  const debouncedSave = useCallback(
    debounce((newValue) => router.replace(`/search/${newValue}`), 500),
    []
  );

  const updateQuery = useCallback((newValue) => {
    setQuery(newValue);
    debouncedSave(newValue);
  }, []);

  useEffect(() => {
    if (!asPath.includes('search'))
      setQuery('')

    if (asPath.includes('search')) {
      setQuery(path?.[1] ?? '')
    }
  }, [asPath, path, updateQuery])


  return (
    <StyledAppBar sx={{ flexGrow: 1, backgroundColor: "background.default" }}
      color='default' position="sticky">
      <Toolbar>
        <Grid container spacing={1} alignItems="center">
          <Grid item sx={{ display: { md: 'none', sm: 'block' } }}>
            <IconButton color="inherit" edge="start" onClick={onDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs sx={{ display: 'flex', alignItems: 'baseline' }}>
            {allowedPaths.find((path) => path === pathname) && (
              <Box className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search Drive...."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  value={query}
                  onMouseDown={onSearchFocus}
                  inputProps={{ 'aria-label': 'search', enterKeyHint: 'search', autoComplete: 'off' }}
                  onChange={(e) => updateQuery(e.target.value)}
                />
                <div className={classes.searchIcon}>
                  <IconButton
                    style={{ height: '35px', width: '35px' }}
                    onClick={() => updateQuery('')}
                    size="large">
                    <CancelIcon />
                  </IconButton>
                </div>
              </Box>
            )}
          </Grid>
          <Grid item>
            <Tooltip title='Change Color'>
              <IconButton size='large' color='inherit' onClick={changeThemeScheme}>
                <ColorIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Switch Theme'>
              <IconButton size='large' color='inherit' onClick={toggleThemeMode}>
                {palette.mode == 'light' ? <DarkIcon /> : <LightIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Reset'>
              <IconButton size='large' color='inherit' onClick={reset}>
                <RestartIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <AccountMenu  router={router} session={session} />
          </Grid>
        </Grid>
      </Toolbar>
    </StyledAppBar>
  );
}
