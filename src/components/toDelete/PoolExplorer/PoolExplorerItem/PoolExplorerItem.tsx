import './PoolExplorerItem.scss';

import React from 'react';
import {useNavigate} from "react-router-dom";

import { iconGenerator } from '../../../../iconGenerator';
import getDecimals from '../../../../utils/getDecimals';
import { Pair } from "../../../../types";
import truncateNum from "../../../../utils/truncateNum";
import { numberConverter } from "../../../../utils/numberConverter";

function MiniIcon(props: {symbol: string, margin?: string }) {
  console.log(props, props.margin)
  return (
    <img
      className="poolExplorer__mini_icon_margin"
      style={{
        marginRight: props.margin
      }}
      src={iconGenerator(props.symbol)}
      alt={props.symbol}
    />
  )
}

function PoolExplorerItem(props: { pair: Pair }) {
console.log("pairs",props)
  function getReserves(num: string | number, dec: number) {
    if (!num) {
      return 0;
    } else {
      return Number(
        (parseFloat(num.toString()) / getDecimals(dec)).toFixed(4),
      ).toLocaleString('ru-RU');
    }
  }

  function getPairRate(rate: any) {
    if (!rate) {
      return 0;
    }
    if (rate < 0.0001) {
      return parseFloat(rate).toFixed(8);
    } else {
      return parseFloat(rate).toFixed(4);
    }
  }

  const router = useNavigate();

  function onClick() {
    router("/pool-explorer/" + props.pair.pairAddress)
  }

  return (
    <React.Fragment>
      <div onClick={onClick}>
        <div className="select-item poolExplorer">
          <div className={"PoolExplorer__tickers"}>
            <div className="poolExplorer__box_pair">
              <img
                className="poolExplorer__icon_margin"
                src={iconGenerator(props.pair.symbolA)}
                alt={props.pair.symbolA}
              />
              <img
                className="poolExplorer__icon_margin"
                style={{ marginLeft: '-25px' }}
                src={iconGenerator(props.pair.symbolB)}
                alt={props.pair.symbolB}
              />
            </div>
            <div style={{display: "flex"}}>
              <span>{props.pair.symbolA}</span>
              <span className="poolExplorer__box_text">/</span>
              <div className="poolExplorer__box_pair">
                <span>{props.pair.symbolB}</span>
              </div>
            </div>
            
          </div>
         
          <div className="poolExplorer__pair_rate">
            <div className="poolExplorer__reserve">
              <span className="select-item-description">
                <div>
                  1  {<MiniIcon symbol={props.pair.symbolA}  margin={"5px"}/>}  ={' '}
                  <span>{getPairRate(props.pair.rateAB)}</span> {<MiniIcon symbol={props.pair.symbolB}/>} 
                </div>
              </span>
            </div>
            <div className="poolExplorer__reserve">
              <span className="select-item-description">
                <div>
                  1 {<MiniIcon symbol={props.pair.symbolB} margin={"5px"}/>}  ={' '}
                  <span>{getPairRate(props.pair.rateBA)}</span> {<MiniIcon symbol={props.pair.symbolA}/>}
                </div>
              </span>
            </div>
          </div>

          <div className={'PoolExplorerItem_pair_reserve_box'}>
            <span>Pair</span>
            <span>reserve</span>
          </div>

          <div className="poolExplorer__reserves">
            <div className="poolExplorer__reserve">
              {getReserves(props.pair.reserveA, 0)}
              <MiniIcon symbol={props.pair.symbolA}/>
              <div className={'PoolExplorerItem_pair_margin_left'}>
                {props.pair.symbolA}
              </div>
            </div>
            <div className="poolExplorer__reserve">
              {getReserves(props.pair.reserveB, 0)}
              <MiniIcon symbol={props.pair.symbolB}/>
              <div className={'PoolExplorerItem_pair_margin_left'}>
                {props.pair.symbolB}
              </div>
            </div>
          </div>
          <div className="poolExplorer__volume_width">
            <div className={'PoolExplorerItem_mobile'}>
              <span>Volume:</span>
            </div>
            {numberConverter(452242)}
          </div>
          <div className="poolExplorer__tvl_width">
            <div className={'PoolExplorerItem_mobile'}>
              <span>TVL:</span>
            </div>
            {numberConverter(234234923489)}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PoolExplorerItem;
