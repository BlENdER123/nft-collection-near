import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import cls from 'classnames';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { iconGenerator } from '../../../../iconGenerator';
import styles from './Card.module.scss';

function Card(props) {
  let pool = props.pool;
  let tokens = props.pool.tokens;
  let [firstToken, setFirstToken] = React.useState(null);
  let [secondToken, setSecondToken] = React.useState(null);
  let [ready, setReady] = React.useState(false);

  useEffect(() => {
    console.log(ready, firstToken, secondToken, tokens);
    if (tokens[0]) setFirstToken(tokens[0]);
    if (tokens[1]) setSecondToken(tokens[1]);
    if (tokens[0] && tokens[1]) setReady(true);
    else setReady(false);
  }, [tokens]);
  return (
    <>
      {ready && (
        <div
          className={styles.Card}
          onClick={() => props.history.push('/farming/' + props.id)}
        >
          <div className={styles.Card__meta}>
            <div className={styles.Card__icons}>
              <img
                className={styles.Card__icon}
                src={iconGenerator(firstToken.name)}
                alt={'First Token Image'}
              />
              <img
                className={styles.Card__icon}
                src={iconGenerator(secondToken.name)}
                alt={'First Token Image'}
              />
            </div>
            <div className={styles.Card__tokens_name}>
              {firstToken.name} - {secondToken.name}{' '}
            </div>
          </div>
          <div className={styles.Card__blocks}>
            <div className={styles.Card__tvl}>
              <div className={styles.Card__text}>Liquidity / TVL</div>
              <div className={styles.Card__block}>
                <div className={styles.Card__tvl_text}>
                  {/* eslint-disable-next-line react/prop-types */}$
                  {Number(pool.tvl).toLocaleString('ru')}
                </div>
                {/* eslint-disable-next-line react/prop-types */}
                <Tooltip
                  title={`${
                    pool.tvl_increase > 0
                      ? `+${pool.tvl_increase}`
                      : `-${pool.tvl_increase}`
                  }%`}
                >
                  <div>
                    {pool.tvl_increase > 0 && <ArrowDropUp color={'success'} />}
                    {pool.tvl_increase < 0 && <ArrowDropDown color={'error'} />}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className={styles.Card__apr}>
              <div className={styles.Card__text}>APR</div>
              <div className={styles.Card__block}>
                <div className={styles.Card__tvl_text}>{pool.apr}%</div>
                <Tooltip
                  title={`${
                    pool.apr_increase > 0
                      ? `+${pool.apr_increase}`
                      : `-${pool.apr_increase}`
                  }%`}
                >
                  <div>
                    {pool.apr_increase > 0 && <ArrowDropUp color={'success'} />}
                    {pool.apr_increase < 0 && <ArrowDropDown color={'error'} />}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={cls(styles.Card__tvl, styles.Card__none_inverse)}>
            <div className={styles.Card__text}>Liquidity / TVL</div>
            <div className={styles.Card__block}>
              <div className={styles.Card__tvl_text}>
                {/* eslint-disable-next-line react/prop-types */}$
                {Number(pool.tvl).toLocaleString('ru')}
              </div>
              {/* eslint-disable-next-line react/prop-types */}
              <Tooltip
                title={`${
                  pool.tvl_increase > 0
                    ? `+${pool.tvl_increase}`
                    : `-${pool.tvl_increase}`
                }%`}
              >
                <div>
                  {pool.tvl_increase > 0 && <ArrowDropUp color={'success'} />}
                  {pool.tvl_increase < 0 && <ArrowDropDown color={'error'} />}
                </div>
              </Tooltip>
            </div>
          </div>
          <div className={cls(styles.Card__apr, styles.Card__none_inverse)}>
            <div className={styles.Card__text}>APR</div>
            <div className={styles.Card__block}>
              <div className={styles.Card__tvl_text}>{pool.apr}%</div>
              <Tooltip
                title={`${
                  pool.apr_increase > 0
                    ? `+${pool.apr_increase}`
                    : `-${pool.apr_increase}`
                }%`}
              >
                <div>
                  {pool.apr_increase > 0 && <ArrowDropUp color={'success'} />}
                  {pool.apr_increase < 0 && <ArrowDropDown color={'error'} />}
                </div>
              </Tooltip>
            </div>
          </div>
          {pool.earned === false && (
            <div>
              <button className={styles.Card__button}>
                Earn
                <img
                  className={styles.Card__button_icon}
                  src={iconGenerator(firstToken.name)}
                  alt={'First Token Image'}
                />
              </button>
            </div>
          )}
          {typeof pool.earned === 'number' && (
            <div className={styles.Card__earned_block}>
              <div className={styles.Card__earned}>
                {pool.earned}{' '}
                <img
                  className={styles.Card__button_icon}
                  src={iconGenerator(firstToken.name)}
                  alt={'First Token Image'}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Card;
