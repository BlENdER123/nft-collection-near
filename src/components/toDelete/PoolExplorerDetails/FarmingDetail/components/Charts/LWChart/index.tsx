import { createChart, CrosshairMode } from 'lightweight-charts';
import React, { useCallback,useEffect, useRef } from 'react';

import { areaData } from './areaData';
import { priceData } from './priceData';
import { volumeData } from './volumeData';

export default function LWChart() {
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
    const candleSeries = chart.current.addCandlestickSeries({
      topColor: 'rgba(19, 68, 193, 0.4)',
      bottomColor: 'rgba(0, 120, 255, 0.0)',
      lineColor: 'rgba(19, 40, 153, 1.0)',
      lineWidth: 1,
    });

    //const areaSeries = chart.current.addAreaSeries();

    candleSeries.setData(areaData);
    let lastClose = areaData[areaData.length - 1].close;
    let lastIndex = areaData.length - 1;

    let targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
    let targetPrice = getRandomPrice();

    let currentIndex = lastIndex + 1;
    let currentBusinessDay = { day: 29, month: 5, year: 2019 };
    let ticksInCurrentBar = 0;
    let currentBar = {
      open: null,
      high: null,
      low: null,
      close: null,
      time: currentBusinessDay,
    };

    function mergeTickToBar(price: number) {
      if (currentBar.open === null) {
        currentBar.open = price as any;
        currentBar.high = price as any;
        currentBar.low = price as any;
        currentBar.close = price as any;
      } else {
        currentBar.close = price as any;
        currentBar.high = Math.max(currentBar.high as any, price) as any;
        currentBar.low = Math.min(currentBar.low as any, price) as any;
      }
      candleSeries.update(currentBar);
    }

    function reset() {
      candleSeries.setData(areaData);
      lastClose = areaData[areaData.length - 1].close;
      lastIndex = areaData.length - 1;

      targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
      targetPrice = getRandomPrice();

      currentIndex = lastIndex + 1;
      currentBusinessDay = { day: 29, month: 5, year: 2019 };
      ticksInCurrentBar = 0;
    }

    function getRandomPrice() {
      return 10 + Math.round(Math.random() * 10000) / 100;
    }

    function nextBusinessDay(time: { day: any; month: any; year: any; }) {
      let d = new Date();
      d.setUTCFullYear(time.year);
      d.setUTCMonth(time.month - 1);
      d.setUTCDate(time.day + 1);
      d.setUTCHours(0, 0, 0, 0);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
      };
    }

    setInterval(function() {
      let deltaY = targetPrice - lastClose;
      let deltaX = targetIndex - lastIndex;
      let angle = deltaY / deltaX;
      let basePrice = lastClose + (currentIndex - lastIndex) * angle;
      let noise = (0.1 - Math.random() * 0.2) + 1.0;
      let noisedPrice = basePrice * noise;
      mergeTickToBar(noisedPrice);
      if (++ticksInCurrentBar === 5) {
        // move to next bar
        currentIndex++;
        currentBusinessDay = nextBusinessDay(currentBusinessDay);
        currentBar = {
          open: null,
          high: null,
          low: null,
          close: null,
          time: currentBusinessDay,
        };
        ticksInCurrentBar = 0;
        if (currentIndex === 5000) {
          reset();
          return;
        }
        if (currentIndex === targetIndex) {
          // change trend
          lastClose = noisedPrice;
          lastIndex = currentIndex;
          targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
          targetPrice = getRandomPrice();
        }
      }
    }, 200);
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
