import { Avatar,Box } from '@mui/material';
import * as React from 'react';

import { iconGenerator } from '../../../../../../iconGenerator';

const styles = {
  label: {
    //opacity: '0.8',
    mb: 1,
  }  as const,
  value: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }  as const,
  token: {
    width: 24,
    height: 24,
    marginRight: 1,
  } as const,
};

export default function PoolPanelCompact(props: { label: React.ReactNode; token: string | undefined; value: React.ReactNode; }) {
  return (
    <>
      <Box sx={styles.label}>{props.label}</Box>
      <Box sx={styles.value}>
        {props.token ? (
          <Avatar
            alt={props.token}
            src={iconGenerator(props.token)}
            sx={styles.token}
          />
        ) : (
          <b></b>
        )}
        <b>{props.value}</b>
      </Box>
    </>
  );
}
