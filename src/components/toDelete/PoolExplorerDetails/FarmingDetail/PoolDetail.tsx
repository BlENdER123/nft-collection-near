import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import {useEffect} from "react";
import {useParams} from "react-router-dom";

import { iconGenerator } from '../../../../iconGenerator';
import AddressesCard from './components/AddressesCard/AddressesCard';
import Charts from './components/Charts/Charts';
import PoolPanel from './components/PoolPanel/PoolPanel';
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { Pair } from "../../../../types";

const styles = {
  main: {
    fontSize: '1rem',
    '& h2': {
      m: 1,
    },
  } as const,
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--mainblock-bg-color)',
    border: '1px solid var(--mainblock-border-color)',
    boxShadow: 0,
    borderRadius: "16px",
    p: 2,
    mb: 2,
    textAlign: 'left',
    '& h4': {
      m: 0,
    },
    '& .MuiIconButton-root': {
      color: 'inherit',
    },
  } as const,
};

export default function PoolDetail() {
  let {pair} = useParams()
  const allPairs = useAppSelector((state) => state.pairs);
  const [info, setPool] = React.useState<Pair | null>(null)
  useEffect(() => {
    
    if(typeof  pair === "string") {
      for(let testPool of allPairs) {
        if(testPool.pairAddress === pair) setPool(testPool)
      }
    }
  }, [pair, allPairs])

  return (
    <React.Fragment>
      {info !== null && <Container sx={styles.main} maxWidth="lg">
        <Grid pt={0} pb={0}>
          <Box
              className="poolExplorer__title"
              // sx={{
              //   display: 'flex',
              //   alignItems: 'center',
              // }}
          >
            <Avatar
                alt={info.symbolA}
                src={iconGenerator(info.symbolA)}
                sx={{
                  width: 40,
                  height: 40,
                  marginLeft: 0,
                  marginRight: 0,
                  zIndex: 1,
                }}
            />
            <Avatar
                alt={info.symbolB}
                src={iconGenerator(info.symbolB)}
                sx={{
                  width: 40,
                  height: 40,
                  marginLeft: -2,
                  marginRight: 2,
                }}
            />
            <Box>
              <Box fontSize={'2rem'}>
                <b>{`Pool ${info.symbolA}/${info.symbolB}`}</b>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid pt={2}>{/* <AlertNoLP /> */}</Grid>
        {/*<Grid pt={2}>*/}
        {/*  <h2 sx={styles.h2}>Pool statistics</h2>*/}
        {/*</Grid>*/}
        <Grid container spacing={2}>
          <Grid
              item
              xs={12}
              sm={12}
              md={4}
              order={{ xs: 2, sm: 2, md: 1, lg: 1 }}
          >
            <Grid>
              <Box sx={styles.card}>
                <PoolPanel
                    pair={info}
                    token0={info.symbolA}
                    token1={info.symbolB}
                />
              </Box>
              
              <Box sx={styles.card}>
                <Box>TVL:</Box>
                <Box>
                  <b></b>
                  <b>$8 225 260.0649</b>
                </Box>
              </Box>
              <Box sx={{...styles.card}}>
                <Box>Trading volume:</Box>
                <Box>
                  <b></b>
                  <b>$9 272 690</b>
                </Box>
              </Box>
              <Box sx={styles.card}>
                <AddressesCard />
              </Box>
            </Grid>
          </Grid>
          <Grid
              item
              xs={12}
              sm={12}
              md={8}
              order={{ xs: 1, sm: 1, md: 2, lg: 2 }}
          >
            <Grid>
              <Box sx={styles.card}>
                <Charts />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/*<Grid pt={2}>*/}
        {/*  <h2 sx={styles.h2}>Transactions list</h2>*/}
        {/*</Grid>*/}
        {/*<Grid>*/}
        {/*  <Box sx={styles.card}>*/}
        {/*    <PoolSpeedTable token={info.tokens[0].name} />*/}
        {/*  </Box>*/}
        {/*</Grid>*/}
       
        <Grid height={50}></Grid>
      </Container>}

    </React.Fragment>
  );
}
