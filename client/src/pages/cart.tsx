import React, { Fragment, useMemo, useCallback } from 'react';
import { TextField, Select, FormControl, InputLabel, MenuItem,
  makeStyles, RadioGroup, FormLabel, FormControlLabel, Radio, 
  Grid, TableContainer, Paper, Table, TableHead, 
  TableRow, TableCell, TableBody, FormHelperText } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import { NumField } from '../components/num-field';
import { OrderButton } from '../components/order-button';
import { CartButton } from '../components/cart-button';
import GET_CART_ITEMS from '../gql/cart.graphql';
import { Illustration } from '../components/illustration';
import { Result, JustOk as Ok, Err , Nothing } from '../util/result'; 
import { useControlState } from '../functions/control';

const GET_COLORS = gql`
  query colors {
    colors {
      hexCode
      name
    }
  }
`;

const GET_SIZES = gql`
  query sizes {
    sizes @client 
  }
`;

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 180
  },
  rows: {
    marginBottom: 15
  }
}));

const useGetColorsQuery = () => {
  const {
    data: colors,
    loading,
    error,
  } = useQuery(GET_COLORS);

  const hexCodeToName = useMemo(() => {
    return colors?.colors.reduce((map: any, x: any) => (map.set(x.hexCode, x.name)), new Map())
  }, [colors]);

  const getColorName = useCallback((hexCode: string) => {
    return hexCodeToName?.get(hexCode);
  }, [colors]);

  return {colors, loading, error, getColorName};
}

const Cart: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const {
    colors,
    loading,
    error,
    getColorName
  } = useGetColorsQuery();
  const {
    data: sizes
  } = useQuery(GET_SIZES);
  const [name, nameHandlers] = useControlState(nameValidation);
  const [age, ageHandlers] = useControlState(ageValidation);
  const [color, colorHandlers] = useControlState();
  const [size , sizeHandlers] = useControlState();

  function nameValidation(name: string): Result<string, Nothing> {
    if (/^([A-ZŚŻŹĄĘÓŁĆ]{1}[a-zà-öø-ÿęąśłżźć]+)$/.test(name)) return Ok();
    else return Err('Name has to be a single word that starts with capital letter.');
  }

  function ageValidation(age: string): Result<string, Nothing> {
    const ageNum = Number(age);
    if (ageNum >= 18 && ageNum <= 100) return Ok();
    else return Err('Age has to be in between 18 and 100.');
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>ERROR</p>
  if (!colors) return <p>Not found</p>

  const options = colors.colors.map((color: any, i: number) => {
    return (<MenuItem key={i} value={color.hexCode}>{color.name}</MenuItem>);
  });

  const radios = sizes.sizes.map((size: string, i: number) => {
    return (<FormControlLabel key={i} value={size} control={<Radio />} label={size} />);
  });

  function handleOrderClick() {
    nameHandlers.touch();
    ageHandlers.touch();
  }

  function handleOrderSubmit() {
    age.reset();
    name.reset();
  }

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Grid container spacing={2} className={classes.rows}>
            <Grid item xs={6}>
              <TextField fullWidth value={name.value} label="Name"
                helperText={name.dirty ? name.error : ''} error={!!name.error && name.dirty}
                onChange={nameHandlers.change} onBlur={nameHandlers.touch}/>
            </Grid>
            <Grid item xs={6}>
              <NumField fullWidth value={age.value} label="Age"
                helperText={age.dirty ? age.error : ''} error={!!age.error && age.dirty}
                onChange={ageHandlers.change} onBlur={ageHandlers.touch}/>
            </Grid>
          </Grid>
          <Grid container spacing={2} className={classes.rows}>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel>Color</InputLabel>
                <Select value={color.value} onChange={colorHandlers.change}>
                  {options}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup aria-label="size" value={size.value} onChange={sizeHandlers.change} row>
                  {radios}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} className={classes.rows}>
            <Grid item xs={6}>
              <CartButton hexCode={color.value} size={size.value} getColorName={getColorName}/>
            </Grid>
            <Grid item xs={6}>
              <OrderButton name={name.value} age={age.value} valid={!name.error && !age.error} 
                onClick={handleOrderClick} onSubmit={handleOrderSubmit} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Illustration hexCode={color.value} size={size.value}/>
        </Grid>
      </Grid>
      <List/>
    </Fragment>
  );
};

export default Cart;

function List(props: any) {
  const {
    data,
    error,
    loading
  } = useQuery(GET_CART_ITEMS);

  const {cartItems} = data as any;
  if (loading) return <p>Loading...</p>
  if (error) return <p>ERROR</p>
  if (!cartItems) return <p>Not found</p>

  const rows = cartItems.map((x: any, i: number) => {
    return (
      <TableRow key={i}>
        <TableCell>{x.color.name}</TableCell>
        <TableCell>{x.size}</TableCell>
        <TableCell>{x.amount}</TableCell>
      </TableRow>
    );
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Color</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
  );
}