"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicHistogram = ({ chartId , data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // ✅ Prepare data: generate category field if start/end exists
    const processedData = data.map(item => {
      if ("range" in item && "count" in item) {
        return { ...item, _category: item.range, _value: item.count };
      } else if ("start" in item && "end" in item && "count" in item) {
        return { ...item, _category: `${item.start}-${item.end}`, _value: item.count };
      } else {
        return item;
      }
    });

    const categoryField = "_category";
    const valueField = "_value";

    // X Axis
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );
    xAxis.data.setAll(processedData);

    // Y Axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Histogram",
        xAxis,
        yAxis,
        valueYField: valueField,
        categoryXField: categoryField,
        tooltip: am5.Tooltip.new(root, {
          labelText: `{${categoryField}}: {${valueField}}`,
        }),
      })
    );

    series.data.setAll(processedData);

    // Animate
    series.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
      <h1>Histogram Bar Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  );
};

export default DynamicHistogram;
