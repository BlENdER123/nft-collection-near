import { Avatar,Box } from '@mui/material';
import * as React from 'react';

import { iconGenerator } from '../../../../../../iconGenerator';
import getDecimals from "../../../../../../utils/getDecimals";

const styles = {
  label: {
    //fonSize: '1rem',
    //opacity: '0.8',
    mb: 0.5,
  },
  value: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 1,
  },
  tokens: {
    width: 24,
    height: 24,
    marginRight: 1,
  },
};
function getReserves(num: string, dec: number) {
    console.log('num, dec', num, dec);
    if (!num) {
        return 0;
    } else {
        return Number(
            (parseFloat(num) / getDecimals(dec)).toFixed(4),
        ).toLocaleString('ru-RU');
    }
}

function getPairRate(rate: string | number) {
    console.log('rate', rate);
    if (!rate) {
        return 0;
    }
    if (rate < 0.0001) {
        return parseFloat(rate.toString()).toFixed(8);
    } else {
        return parseFloat(rate.toString()).toFixed(4);
    }
}
export default function PoolPanel(props: { token0: string; pair: { rateAB: string | number; rateBA: string | number; }; token1: string }) {
  return (
    <>
      <Box sx={styles.label}>Cost per token:</Box>
      <Box sx={styles.value}>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>1 {props.token0}  <Avatar
              alt={props.token0}
              src={iconGenerator(props.token0)}
              sx={{...styles.tokens, marginLeft: 1}}
          /></Box>

          <Box sx={{fontWeight: "bold", display:"flex", flexDirection:"row", alignItems:"center"}}>{getPairRate(props.pair.rateAB)} {' '}
              {props.token1}  <Avatar
              alt={props.token1}
              src={iconGenerator(props.token1)}
              sx={{...styles.tokens, marginLeft: 1, marginRight:0}}
          /></Box>
      </Box>
        <Box sx={styles.value}>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>1 {props.token1} <Avatar
                alt={props.token1}
                src={iconGenerator(props.token1)}
                sx={{...styles.tokens, marginLeft: 1}}
            /></Box>

            <Box sx={{fontWeight: "bold", display:"flex", flexDirection:"row", alignItems:"center"}}>{getPairRate(props.pair.rateBA)} {' '}
                {props.token0}  <Avatar
                    alt={props.token0}
                    src={iconGenerator(props.token0)}
                    sx={{...styles.tokens, marginLeft: 1, marginRight:0}}
                /></Box>
        </Box>
    </>
  );
}
