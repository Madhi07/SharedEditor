import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicBarChart = ({ chartId = "chartdiv", data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomY",
        pinchZoomY: true,
        paddingLeft: 0,
        paddingRight: 1,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);

    // ✅ Auto-detect keys
    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string" || typeof data[0][k] === "number");
    const valueField = keys.find((k) => typeof data[0][k] === "number");

    // Y Axis (Category Axis)
    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: categoryField,
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // X Axis (Value Axis)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, { strokeOpacity: 0.1 }),
      })
    );

    // Series (Horizontal Bars)
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis,
        yAxis,
        valueXField: valueField,
        categoryYField: categoryField,
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, { labelText: `{${valueField}}` }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
      height: am5.percent(70),
    });

    series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    // Set Data
    yAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

   return (
    <>
      <h1>Horizontal Bar Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  )
};

export default DynamicBarChart;
