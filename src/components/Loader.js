import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress'
const PREFIX = 'Toploader';

const classes = {
  root: `${PREFIX}-root`,
  colorPrimary: `${PREFIX}-colorPrimary`,
  barColorPrimary: `${PREFIX}-barColorPrimary`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 2,
  },

  [`& .${classes.colorPrimary}`]: {
    backgroundColor: 'transparent',
    height: '3px',
  },

  [`& .${classes.barColorPrimary}`]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'default',
  }
}));

export default function Loader() {

  const [progress, setProgress] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Root className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={progress}
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
      />
    </Root>
  );
}