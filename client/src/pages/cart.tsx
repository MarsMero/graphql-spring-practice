import React, { Fragment, useState, useEffect } from 'react';
import { TextField, Select, FormControl, InputLabel, MenuItem,
  makeStyles, RadioGroup, FormLabel, FormControlLabel, Radio, 
  Grid, Button, TableContainer, Paper, Table, TableHead, 
  TableRow, TableCell, TableBody } from '@material-ui/core';
import { gql, useQuery, useMutation } from '@apollo/client';
import { NumField } from '../components/num-field';
import GET_CART_ITEMS from '../gql/cart-items.graphql';

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

const ADD_TO_CART = gql`
  mutation addToCart($color: Color!, $size: String!) {
    addToCart(color: $color, size: $size) @client
  }
`;

const GET_UNITS = gql`
  query units {
    units {
      hexCode
      size
      stockAmount
    }
  }
`;

const GET_CART_ITEM = gql`
  query cartItem($hexCode: String!, $size: String!) {
    cartItem(hexCode: $hexCode, size: $size) @client {
      color {
        hexCode
        name
      }
      size
      amount
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 180
  },
  rows: {
    marginBottom: 15
  },
  vis: {
    height: '100px',
    width: 100,
    backgroundColor: '#00FFFF'
  }
}));

const useGetColorsQuery = () => {
  const {
    data: colors,
    loading,
    error,
  } = useQuery(GET_COLORS);

  const [map, setMap] = useState(new Map());

  useEffect(() => {
    if (!error && !loading) {
      const newMap = colors.colors.reduce((map: Map<string, string>, x:any) => (map.set(x.hexCode, x.name)), new Map())
      setMap(newMap);
    }
  }, [colors]);

  return {colors, loading, error, hexCodeToName: map};
}

const Cart: React.FC = () => {
  const classes = useStyles();
  const {
    colors,
    loading,
    error,
    hexCodeToName
  } = useGetColorsQuery();
  const {
    data: sizes
  } = useQuery(GET_SIZES);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  if (loading) return <p>Loading...</p>
  if (error) return <p>ERROR</p>
  if (!colors) return <p>Not found</p>

  const options = colors.colors.map((color: any, i: number) => {
    return (<MenuItem key={i} value={color.hexCode}>{color.name}</MenuItem>);
  });

  const radios = sizes.sizes.map((size: string, i: number) => {
    return (<FormControlLabel key={i} value={size} control={<Radio />} label={size} />);
  });

  return (
    <Fragment>
      <Grid container spacing={2} className={classes.rows}>
        <Grid item xs={3}>
          <TextField fullWidth value={name} label="Name" onChange={handleChangeWith(setName)}/>
        </Grid>
        <Grid item xs={3}>
        <NumField fullWidth value={age} label="Age" onChange={handleChangeWith(setAge)}/>
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.rows}>
        <Grid item xs={3}>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel>Color</InputLabel>
            <Select value={color} onChange={handleChangeWith(setColor)}>
              {options}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl>
            <FormLabel component="legend">Size</FormLabel>
            <RadioGroup aria-label="size" value={size} onChange={handleChangeWith(setSize)} row>
              {radios}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.rows}>
        <Grid item xs={3}>
          <CartButton color={color} size={size} hexCodeToName={hexCodeToName}/>
        </Grid>
      </Grid>
      <OrderButton name={name} age={age} valid/>
      <List/>
    </Fragment>
  );
};

export default Cart;

function handleChangeWith(setState: any) {
  return (event: any) => setState(event.target.value)
}
// TODO move button to new file
function CartButton(props: any) {
  const {
    color,
    size,
    hexCodeToName
  } = props
  const [mutate, {loading}] = useMutation(ADD_TO_CART, {
    variables: {
      color: {
        name: hexCodeToName.get(color),
        hexCode: color
      },
      size
    },
    refetchQueries: [
      {
        query: GET_CART_ITEM,
        variables: {
          hexCode: color,
          size
        }
      }
    ]
  });
  const {data: unitData} = useQuery(GET_UNITS);
  const [disabled, setDisabled] = useState(true);
  const {data: cartData} = useQuery(GET_CART_ITEM, {
    variables: {
      hexCode: color,
      size
    }
  });

  useEffect(() => {
    function canAddToCart(): boolean {
      if (!unitData || !color || !size) {
        return false;
      }
      const {stockAmount} = unitData.units.find((x: any) => x.hexCode === color && x.size === size)
      const cartAmount = cartData ? cartData.cartItem.amount : 0;
      return stockAmount > cartAmount;
    }

    setDisabled(!canAddToCart())
  },[unitData, cartData, color, size]);


  const handleClick = () => {
    mutate();
  };
  return (
    <Button onClick={handleClick} variant="contained" color="primary" 
      disabled={disabled}>Add</Button>
  );
}

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

const PLACE_ORDER = gql`
  mutation placeOrder($age: Int!, $name: String!, $units: [OrderUnitInput]) {
    placeOrder(params: {
      age: $age
      name: $name
      units: $units
    })
  }
`;
// TODO move to another file
const OrderButton: React.FC<any> = (props: any) => {
  const {
    name,
    age,
    valid
  } = props;
  const [disabled, setDisabled] = useState(true);
  const {
    data,
    error,
    loading
  } = useQuery(GET_CART_ITEMS);
  const [mutate] = useMutation(PLACE_ORDER);

  useEffect(() => {
    function canOrder(): boolean {
      return valid && data.cartItems.length > 0;
    }
    setDisabled(!canOrder());
  }, [valid, data]);

  const handleClick = () => {
    setDisabled(true);
    const units = data.cartItems.map((x: any) => ({
      amount: x.amount,
      size: x.size,
      hexCode: x.color.hexCode
    }))
    const numAge = parseInt(age);
    mutate({
      variables: {
        age: numAge,
        name,
        units
      }
    })
  }
  return (
    <Button onClick={handleClick} variant="contained" color="primary" 
      disabled={disabled}>Order</Button>
  );
}
