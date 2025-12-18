"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicDualAxisChart = ({ chartId , data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
      })
    );

    // Detect fields automatically
    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string");
    const numericFields = keys.filter((k) => typeof data[0][k] === "number");

    if (!categoryField || numericFields.length < 2) {
      console.warn("Need 1 category field + at least 2 numeric fields");
      return;
    }

    const [valueFieldLeft, valueFieldRight] = numericFields;

    // X Axis
    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.data.setAll(data);
    xAxis.children.push(
      am5.Label.new(root, {
        text: "Category",
        x: am5.p50,
        centerX: am5.p50,
      })
    );

    // Y Axis (Left)
    const yAxisLeft = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yAxisLeft.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Left Value",
        y: am5.p50,
        centerX: am5.p50,
      })
    );

    // Y Axis (Right)
    const yAxisRight = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yAxisRight.children.unshift(
      am5.Label.new(root, {
        rotation: 90,
        text: "Right Value",
        y: am5.p50,
        centerX: am5.p50,
      })
    );

    // Series 1 (Column on left axis)
    const series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: valueFieldLeft,
        xAxis,
        yAxis: yAxisLeft,
        valueYField: valueFieldLeft,
        categoryXField: categoryField,
        tooltip: am5.Tooltip.new(root, {
          labelText: `{${categoryField}}: {${valueFieldLeft}}`,
        }),
      })
    );
    series1.data.setAll(data);

    // Series 2 (Line on right axis)
    const series2 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: valueFieldRight,
        xAxis,
        yAxis: yAxisRight,
        valueYField: valueFieldRight,
        categoryXField: categoryField,
        stroke: am5.color(0x00cc99),
        tooltip: am5.Tooltip.new(root, {
          labelText: `{${categoryField}}: {${valueFieldRight}}`,
        }),
      })
    );
    series2.strokes.template.setAll({ strokeWidth: 2 });
    series2.data.setAll(data);

    // Add legend
    chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 }));

    // Animate
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
      <h1>Dual Axis Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />
    </>
  )
};

export default DynamicDualAxisChart;
