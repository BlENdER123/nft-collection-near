import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';

const styles = {
  main: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as const,
  label: {} as const,
  address: { display: 'flex', alignItems: 'center' } as const,
};

const adresses = [
  {
    label: 'Pair address ',
    adrress: '0:29d6...fe05',
  },
  {
    label: 'Root address',
    adrress: '0:674c...6fdb',
  },
  {
    label: 'WTON Address',
    adrress: '0:6b5b...f49a',
  },
  {
    label: 'USDT Address',
    adrress: '0:53c8...7434',
  }
];

export default function AddressesCard() {
  return (
    <>
      <h4>Addresses</h4>
      {adresses.map((e, i) => (
        <Box key={i} sx={styles.main}>
          <Box sx={styles.label}>{e.label}</Box>
          <Box sx={styles.address}>
            <b>{e.adrress}</b>
            <IconButton aria-label="copy">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </>
  );
}
