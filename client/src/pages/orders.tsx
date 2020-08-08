import React, { Fragment, useState, useEffect } from 'react';
import { Paper, TableContainer, TableHead, TableCell, Table,
  TableRow, TableBody, IconButton, Collapse, Box } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { GET_ORDERS } from '../gql/orders.graphql';
import { Illustration } from '../components/illustration';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

export const Orders: React.FC<any> = (props: any) => {
  const {
    data,
    error,
    loading
  } = useQuery(GET_ORDERS);

  if (loading) return <p>Loading...</p>
  if (error) return <p>ERROR</p>
  if (!data) return <p>Not found</p>
  const orders = data && data.orders.map((order: any, i: number) => {
    return (
      <Order key={i} {...order}/>
    );
  });

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

function Order(props: any) {
  const [opened, setOpened] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell> 
          <IconButton aria-label="expand row" size="small" onClick={() => setOpened(!opened)}>
            {opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{props.name}</TableCell>
        <TableCell>{props.age}</TableCell>
        <TableCell>{props.timestamp}</TableCell>
      </TableRow>
      <Units units={props.units} opened={opened}></Units>
    </Fragment>
  );
}

function Units(props: any) {
  const units = props.units.map((unit: any, i: number) => {
    return (
      <TableRow key={i}>
        <TableCell>{unit.hexCode}</TableCell>
        <TableCell>{unit.size}</TableCell>
        <TableCell>{unit.amount}</TableCell>
        <TableCell><Illustration size={unit.size} hexCode={unit.hexCode}/></TableCell>
      </TableRow>
    );
  })
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
        <Collapse in={props.opened} timeout="auto" unmountOnExit>
          <Box margin={1}>

          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Color</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center">Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units}
            </TableBody>
          </Table>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}