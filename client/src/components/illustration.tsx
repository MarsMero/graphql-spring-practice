import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 180
  },
  rows: {
    marginBottom: 15
  },
  illustrationWrapper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  illustration: {
    height: (props: any) => sizeToPx(props.size),
    width: (props: any) => sizeToPx(props.size),
    backgroundColor: (props: any) => props.hexCode,
    margin: 0
  }
}));

export const Illustration = React.memo((props: any) => {
  const classes = useStyles(props);
  return (
    <Box className={classes.illustrationWrapper}>
      <Box className={classes.illustration}/>
    </Box>
  );
});

function sizeToPx(size: string) {
  switch(size) {
    case 'S': return 25;
    case 'M': return 50;
    case 'L': return 75;
    case 'XL': return 100;
  }
}