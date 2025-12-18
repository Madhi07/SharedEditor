'use client';

import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const BubbleChart = () => {
  const chartId = "chartdiv";

  const data = [
    { name: "Radiohead", x: 50, y: 50, value: 100 },
    { name: "Thom Yorke", x: 55, y: 52, value: 60 },
    { name: "Mozart", x: 20, y: 80, value: 40 },
    { name: "Bach", x: 25, y: 75, value: 35 },
    { name: "Elvis Presley", x: 70, y: 30, value: 50 },
    { name: "Eminem", x: 80, y: 40, value: 45 },
    { name: "Kanye West", x: 85, y: 35, value: 55 },
    { name: "Morrissey", x: 40, y: 60, value: 30 },
    { name: "John Lennon", x: 65, y: 65, value: 50 },
    { name: "St. Germain", x: 35, y: 45, value: 25 },
    { name: "Philip Glass", x: 30, y: 50, value: 20 },
    { name: "Explosions in the Sky", x: 45, y: 40, value: 30 },
    { name: "Outkast", x: 75, y: 55, value: 40 }
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Dispose existing root if it exists
    am5.array.each(am5.registry.rootElements, function (existingRoot) {
      if (existingRoot.dom.id === chartId) {
        existingRoot.dispose();
      }
    });

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "panY"
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        min: 0,
        max: 100,
        strictMinMax: true
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0,
        max: 100,
        strictMinMax: true
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "x",
        valueYField: "y",
        // important: turn off connecting lines
        stroke: am5.color(0x00000000), 
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {value}"
        })
      })
    );

    // Bubbles
    series.bullets.push((root, series, dataItem) => {
      const value = dataItem.dataContext.value;
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: Math.sqrt(value), // scale radius by value
          fillOpacity: 0.7,
          fill: am5.color(0x5e5e5e),
          tooltipText: "{name}: {value}"
        })
      });
    });

    series.data.setAll(data);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id={chartId} style={{ width: "100%", height: "500px" }} />;
};

export default BubbleChart;
