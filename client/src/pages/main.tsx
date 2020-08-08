import React, { Fragment, useState } from 'react';
import Cart from './cart';
import { Container, AppBar, Tabs, Tab, Box, makeStyles} from '@material-ui/core';
import { Router, navigate } from '@reach/router';
import { Orders } from './orders';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Pages(props: any) {
  return (
    <Fragment>
      <Container>
        <Body/>
      </Container>
    </Fragment>
  );
}

function Body(props: any) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const paths = ["/", "cart"];
  function handleChange(_: any, val: number) {
    setValue(val);
    navigate(paths[val]);
  }

  return (
    <Fragment>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Orders"/>
          <Tab label="Cart" />
        </Tabs>
      </AppBar>
      <Box p={3} className={classes.root}>
        <Router>
          <Cart path="cart"/>
          <Orders path="/"/>
        </Router>
      </Box>
    </Fragment>
  );
}