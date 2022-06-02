import { createChart } from 'lightweight-charts';
import React, { useCallback,useEffect, useRef } from 'react';

import { tvlData } from './tvlData';

export default function TVLChart() {
  const chartContainerRef = useRef<HTMLDivElement>(document.createElement("div"))!;
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();

  const handleTooltip = useCallback((series) => {
    //console.log((Math.round(price * 100) / 100).toFixed(2));
    console.log('areaSeries');
  }, []);

  function handleClick(param: { point: { x: any; y: any; }; time: any; }) {
    if (!param.point) {
      return;
    }

    console.log(
      `An user clicks at (${param.point.x}, ${param.point.y}) point, the time is ${param.time}`,
    );
  }

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 440,

      rightPriceScale: {
        scaleMargins: {
          top: 0.35,
          bottom: 0.2,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      layout: {
        backgroundColor: 'transparent',
        textColor: 'var(--text-color)',
      },
      grid: {
        horzLines: {
          color: '#eee',
          visible: true,
        },
        vertLines: {
          color: '#ffffff',
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        vertLine: {
          visible: true,
          // style: 0,
          // width: 2,
          // color: "rgba(32, 38, 46, 0.1)",
          labelVisible: true,
        },
      },
    });

    const areaSeries = chart?.current.addAreaSeries({
      topColor: 'rgba(19, 68, 193, 0.4)',
      bottomColor: 'rgba(0, 120, 255, 0.0)',
      lineColor: 'rgba(19, 40, 153, 1.0)',
      lineWidth: 1,
    });

    areaSeries.setData(tvlData);
    //areaSeries.subscribeClick(handleClick);
  }, []);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });

      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <div
      onTouchStart={handleTooltip}
      onTouchMove={handleTooltip}
      onMouseMove={handleTooltip}
      ref={chartContainerRef}
    />
  );
}
