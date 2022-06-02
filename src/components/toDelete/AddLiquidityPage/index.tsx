import "./index.scss";

import { useFormik } from "formik";
import compact from "lodash/compact";
import find from "lodash/find";
import reject from "lodash/reject";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AB_DIRECTION, BA_DIRECTION } from "../../../constants/runtimeVariables";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import useSelectPopup from "../../../hooks/useSelectPopup";
import { setProvideLiquidityConfirmValues } from "../../../store/actions/app";
import { LpToken, ProvideLiquidityValuesFormik, Token } from "../../../types";
import getSumsForProvide from "../../../utils/getSumsForProvide";
import Input from "../Input";
import MainBlock from "../MainBlock";
import SelectPopup from "../SelectPopup";

function AddLiquidity() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  const tokens = useAppSelector((state) => state.tokens);
  const lpTokens = useAppSelector((state) => state.lpTokens);
  const walletIsConnected = useAppSelector((state) => state.client);
  const pairs = useAppSelector((state) => state.pairs);

  const fromToken = useMemo(
    () => find(tokens, { rootAddress: params.get("from") }) as Token | null,
    [params, tokens],
  );
  const toToken = useMemo(
    () => find(tokens, { rootAddress: params.get("to") }) as Token | null,
    [params, tokens],
  );

  const { values, handleChange, handleBlur, setFieldValue } =
    useFormik<ProvideLiquidityValuesFormik>({
      initialValues: {
        fromToken,
        toToken,
        fromValue: "",
        toValue: "",
        pair: null,
      },
      onSubmit: handleConfirm,
      enableReinitialize: true,
    });

  const directionPair = useMemo(() => {
    if (values.fromToken && values.pair)
      return values.fromToken.rootAddress === values.pair.rootA
        ? AB_DIRECTION
        : BA_DIRECTION;
  }, [values.fromToken, values.pair]);

  const [totalLPs, settotalLPs] = useState(0);
  const [poolSharePercentage, setpoolSharePercentage] = useState(0);

  const lpToken = useMemo(
    () => find(lpTokens, { pairAddress: values.pair?.pairAddress }),
    [values.pair, lpTokens],
  );

  // Find the pair
  useEffect(() => {
    if (!pairs.length || !values.fromToken || !values.toToken) return;

    setFieldValue(
      "pair",
      find(pairs, {
        rootA: values.fromToken.rootAddress,
        rootB: values.toToken.rootAddress,
      }) ||
        find(pairs, {
          rootA: values.toToken.rootAddress,
          rootB: values.fromToken.rootAddress,
        }),
    );
  }, [pairs, values.fromToken, values.toToken, setFieldValue]);

  function getTotalLP(
    qtyA: number,
    qtyB: number,
    reserveA: number,
    reserveB: number,
    totalSupplyBefore: number,
  ) {
    let qtyArr = getSumsForProvide(qtyA, qtyB, reserveA, reserveB, 1);
    let provideArr = getSumsForProvide(
      qtyArr[0],
      qtyArr[1],
      reserveA,
      reserveB,
      0,
    );
    return Math.min(
      Math.floor((provideArr[0] * totalSupplyBefore) / reserveA),
      Math.floor((provideArr[1] * totalSupplyBefore) / reserveB),
    );
  }

  function handleConfirm() {
    dispatch(
      setProvideLiquidityConfirmValues({
        fromToken: values.fromToken as Token,
        toToken: values.toToken as Token,
        fromValue: values.fromValue as number,
        toValue: values.toValue as number,
        lpToken: lpToken as LpToken,
        lpValue: (values.fromValue as number) + (values.toValue as number),
      }),
    );
  }

  function mixPercentValue(totalLP: number, totalSup: number) {
    let percOfTotal = (totalLP * 100) / totalSup;
    return +percOfTotal;
  }

  useEffect(() => {
    setpoolSharePercentage(0);
    settotalLPs(0);
  }, [values.fromToken, values.toToken]);

  useEffect(() => {
    if (!values.fromValue || !values.toValue || !values.pair) {
      settotalLPs(0);
      setpoolSharePercentage(0);
      return;
    }
    const totals =
      getTotalLP(
        values.fromValue * 1000000000,
        values.toValue * 1000000000,
        values.pair.reserveA * 1000000000,
        values.pair.reserveB * 1000000000,
        values.pair.totalSupply * 1000000000,
      ) / 1000000000;

    let totalLP =
      getTotalLP(
        (values.fromValue || 0) * 1000000000,
        (values.toValue || 0) * 1000000000,
        values.pair.reserveA * 1000000000,
        values.pair.reserveB * 1000000000,
        values.pair.totalSupply * 1000000000,
      ) / 1000000000;

    const poolShare = mixPercentValue(totalLP, values.pair.totalSupply).toFixed(
      4,
    );

    setpoolSharePercentage(+poolShare);
    settotalLPs(totals);
  }, [values.fromValue, values.toValue, values.pair]);

  function getNumType(num: number) {
    const t = parseFloat("" + num);
    let tt = +t;
    if (Number(tt.toFixed(4)) === 0) {
      return t;
    } else {
      return tt.toFixed(4);
    }
  }

  const fromTokens = useMemo(() => {
    if (!values.toToken) return tokens;
    let leftTokens = reject(tokens, values.toToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.toToken?.rootAddress ||
        p.rootB === values.toToken?.rootAddress,
    );
    leftTokens = leftPairs.map(
      (p) =>
        find(leftTokens, { rootAddress: p.rootA }) ||
        find(leftTokens, { rootAddress: p.rootB }),
    ) as Token[];

    return compact(leftTokens);
  }, [tokens, pairs, values.toToken]);

  const toTokens = useMemo(() => {
    if (!values.fromToken) return tokens;
    let leftTokens = reject(tokens, values.fromToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.fromToken?.rootAddress ||
        p.rootB === values.fromToken?.rootAddress,
    );
    leftTokens = leftPairs.map(
      (p) =>
        find(leftTokens, { rootAddress: p.rootA }) ||
        find(leftTokens, { rootAddress: p.rootB }),
    ) as Token[];

    return compact(leftTokens);
  }, [tokens, pairs, values.fromToken]);

  const selectFromPopup = useSelectPopup((t) => setFieldValue("fromToken", t));
  const selectToPopup = useSelectPopup((t) => setFieldValue("toToken", t));

  return (
    <div className="container" style={{ flexDirection: "column" }}>
      <MainBlock
        smallTitle={false}
        title={
          <Link to={`/manage/${lpToken?.walletAddress}`} className="pool-back">
            <svg
              width="12"
              height="19"
              viewBox="0 0 12 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.9142 4.4108C11.6953 3.62975 11.6953 2.36342 10.9142 1.58237C10.1332 0.80132 8.86684 0.80132 8.08579 1.58237L10.9142 4.4108ZM2.5 9.99658L1.08579 8.58237C0.304738 9.36342 0.304738 10.6297 1.08579 11.4108L2.5 9.99658ZM8.08579 18.4108C8.86683 19.1918 10.1332 19.1918 10.9142 18.4108C11.6953 17.6297 11.6953 16.3634 10.9142 15.5824L8.08579 18.4108ZM8.08579 1.58237L1.08579 8.58237L3.91421 11.4108L10.9142 4.4108L8.08579 1.58237ZM1.08579 11.4108L8.08579 18.4108L10.9142 15.5824L3.91421 8.58237L1.08579 11.4108Z"
                fill="white"
              />
            </svg>
            Add liquidity
          </Link>
        }
        content={
          <div>
            <Input
              label="From"
              name="fromValue"
              token={values.fromToken}
              value={values.fromValue}
              onValueChange={handleChange}
              onValueBlur={handleBlur}
              onSelectClick={selectFromPopup.handleOpen}
            />
            <svg
              className="add-liquidity-plus"
              style={{ marginTop: "26px" }}
              width="45"
              height="46"
              viewBox="0 0 45 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3324 42.0171L19.33 26.1694L3.48234 26.167C3.06611 26.1679 2.6538 26.0866 2.26908 25.9277C1.88435 25.7689 1.5348 25.5356 1.24048 25.2413C0.946162 24.947 0.712873 24.5974 0.554009 24.2127C0.395143 23.828 0.31383 23.4157 0.314741 22.9994C0.313831 22.5832 0.395143 22.1709 0.554008 21.7862C0.712873 21.4014 0.94616 21.0519 1.24048 20.7576C1.5348 20.4632 1.88435 20.23 2.26907 20.0711C2.6538 19.9122 3.06611 19.8309 3.48234 19.8318L19.33 19.8294L19.3324 3.98176C19.3315 3.56553 19.4128 3.15322 19.5717 2.7685C19.7305 2.38378 19.9638 2.03422 20.2581 1.7399C20.5525 1.44558 20.902 1.21229 21.2867 1.05343C21.6715 0.894565 22.0838 0.813252 22.5 0.814161C22.9162 0.813252 23.3285 0.894565 23.7133 1.05343C24.098 1.21229 24.4475 1.44558 24.7419 1.7399C25.0362 2.03422 25.2695 2.38378 25.4283 2.7685C25.5872 3.15322 25.6685 3.56553 25.6676 3.98176L25.67 19.8294L41.5177 19.8318C41.9339 19.8309 42.3462 19.9122 42.7309 20.0711C43.1156 20.23 43.4652 20.4632 43.7595 20.7576C44.0538 21.0519 44.2871 21.4014 44.446 21.7862C44.6049 22.1709 44.6862 22.5832 44.6853 22.9994C44.6862 23.4157 44.6049 23.828 44.446 24.2127C44.2871 24.5974 44.0538 24.947 43.7595 25.2413C43.4652 25.5356 43.1156 25.7689 42.7309 25.9277C42.3462 26.0866 41.9339 26.1679 41.5177 26.167L25.67 26.1694L25.6676 42.0171C25.6685 42.4333 25.5872 42.8456 25.4283 43.2303C25.2695 43.6151 25.0362 43.9646 24.7419 44.2589C24.4475 44.5533 24.098 44.7865 23.7133 44.9454C23.3285 45.1043 22.9162 45.1856 22.5 45.1847C22.0838 45.1856 21.6715 45.1043 21.2867 44.9454C20.902 44.7865 20.5525 44.5533 20.2581 44.2589C19.9638 43.9646 19.7305 43.6151 19.5717 43.2303C19.4128 42.8456 19.3315 42.4333 19.3324 42.0171Z"
                fill="#41444E"
              />
            </svg>
            <Input
              label="To"
              name="toValue"
              token={values.toToken}
              value={values.toValue}
              onValueChange={handleChange}
              onValueBlur={handleBlur}
              onSelectClick={selectToPopup.handleOpen}
            />

            {!values.pair || !values.pair.reserveA || !values.pair.reserveB ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                The pair is empty - you can set the rate by supplying it.
                <div className="add-liquidity-wrapper"></div>
              </div>
            ) : (
              values.fromToken &&
              values.toToken &&
              values.pair && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div className="add-liquidity-wrapper">
                    <div>
                      <span>
                        {
                          totalLPs
                          //todo check
                          // getTotalLP(
                          //     fromValue * 1000000000,
                          //     toValue * 1000000000,
                          //     ratesData.reservesA * 1000000000,
                          //     ratesData.reservesB * 1000000000,
                          //     ratesData.totalSupply * 1000000000,
                          // ) /
                          // 1000000000 !==
                          // 0
                          //     ? getTotalLP(
                          //     fromValue * 1000000000,
                          //     toValue * 1000000000,
                          //     ratesData.reservesA * 1000000000,
                          //     ratesData.reservesB * 1000000000,
                          //     ratesData.totalSupply * 1000000000,
                          //     ) /
                          //     1000000000 <
                          //     0.0001
                          //     ? (
                          //         getTotalLP(
                          //             fromValue * 1000000000,
                          //             toValue * 1000000000,
                          //             ratesData.reservesA * 1000000000,
                          //             ratesData.reservesB * 1000000000,
                          //             ratesData.totalSupply * 1000000000,
                          //         ) / 1000000000
                          //     ).toFixed(6)
                          //     : (
                          //         getTotalLP(
                          //             fromValue * 1000000000,
                          //             toValue * 1000000000,
                          //             ratesData.reservesA * 1000000000,
                          //             ratesData.reservesB * 1000000000,
                          //             ratesData.totalSupply * 1000000000,
                          //         ) / 1000000000
                          //     ).toFixed(4)
                          //     : (
                          //         getTotalLP(
                          //             fromValue * 1000000000,
                          //             toValue * 1000000000,
                          //             ratesData.reservesA * 1000000000,
                          //             ratesData.reservesB * 1000000000,
                          //             ratesData.totalSupply * 1000000000,
                          //         ) / 1000000000
                          //     ).toFixed(4)
                        }
                      </span>
                      You will receive LP tokens
                    </div>

                    <div>
                      <span>
                        {directionPair === AB_DIRECTION
                          ? getNumType(values.pair.rateBA)
                          : getNumType(values.pair.rateAB)}{" "}
                      </span>
                      {values.fromToken.symbol} per 1 {values.toToken.symbol}
                    </div>

                    <div>
                      <span>
                        {directionPair === AB_DIRECTION
                          ? getNumType(values.pair.rateAB)
                          : getNumType(values.pair.rateBA)}
                      </span>
                      {values.toToken.symbol} per 1 {values.fromToken.symbol}
                    </div>
                  </div>

                  <div className="add-liquidity-wrapper">
                    <div>
                      <span>{`${poolSharePercentage} %`}</span>
                      Your share of pool
                    </div>
                    <div>
                      <span>{getNumType(values.pair.reserveA)}</span>
                      {values.fromToken.symbol} pooled
                    </div>

                    <div>
                      <span>{getNumType(values.pair.reserveB)}</span>
                      {values.toToken.symbol} pooled
                    </div>
                  </div>
                </div>
              )
            )}
            {walletIsConnected ? (
              <button
                onClick={() => handleConfirm()}
                className="btn mainblock-btn"
              >
                Supply
              </button>
            ) : (
              <button
                className="btn mainblock-btn"
                onClick={() => navigate("/account")}
              >
                Connect wallet
              </button>
            )}
          </div>
        }
      />

      {selectFromPopup.open && (
        <SelectPopup
          tokens={fromTokens}
          onClose={selectFromPopup.handleClose}
          onSelect={selectFromPopup.handleSelect}
        />
      )}
      {selectToPopup.open && (
        <SelectPopup
          tokens={toTokens}
          onClose={selectToPopup.handleClose}
          onSelect={selectToPopup.handleSelect}
        />
      )}
    </div>
  );
}

export default AddLiquidity;
