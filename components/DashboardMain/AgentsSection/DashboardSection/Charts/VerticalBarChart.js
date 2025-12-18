"use client";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicBarChart = ({
  chartId = "barchartdiv",
  data,
  width = "100%",
  height = "400px",
  title,
  x, // X-axis title
  y, // Y-axis title
}) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Dynamically measure width
  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById(chartId);
      if (el) setContainerWidth(el.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [chartId]);

  // Determine font size based on width ranges
  const getFontSizeByWidth = (width) => {
    if (width < 300) return 12;
    if (width < 500) return 14;
    if (width < 1200) return 16;
    return 18;
  };

useLayoutEffect(() => {
  if (!data || data.length === 0 || containerWidth === 0) return;

  if (rootRef.current) rootRef.current.dispose();

  const root = am5.Root.new(chartId);
  rootRef.current = root;
  if (root._logo) root._logo.dispose();

  root.setThemes([am5themes_Animated.new(root)]);

  // ✅ Use stepped font size logic
  const baseFontSize = getFontSizeByWidth(containerWidth);
  const axisFontSize = baseFontSize;
  const titleFontSize = baseFontSize + 2;

  // Create chart
  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout,
      paddingTop: 5,
      paddingBottom: 20,
      // The incorrect 'tooltip:`category`' has been removed
    })
  );

  // 👇 ADD CHART CURSOR (This enables the interactive tooltip on hover)
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  // Optional: Hide the horizontal cursor line common for bar/column charts
  cursor.lineY.set("visible", false);
  // Optional: Make the X-axis line (vertical line) of the cursor dashed
  cursor.lineX.set("strokeDasharray", [2, 2]);

  // Data key detection
  const keys = Object.keys(data[0]);
  const numericKeys = keys.filter((k) => typeof data[0][k] === "number");
  const labelKeys = keys.filter((k) => !numericKeys.includes(k));

  const transformedData = data.map((item) => ({
    ...item,
    label: labelKeys.map((k) => item[k]).join(" - "),
  }));

  // X Axis
  const xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 30,
  });

  // ... (rest of the X Axis code is unchanged)

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "label",
      renderer: xRenderer,
    })
  );

  xAxis.data.setAll(transformedData);

  xRenderer.labels.template.setAll({
    rotation: -45,
    centerY: am5.p50,
    centerX: am5.p100,
    fontSize: axisFontSize,
    maxWidth: 120,
    oversizedBehavior: "wrap",
  });

  // Y Axis
  const yRenderer = am5xy.AxisRendererY.new(root, {});
  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: yRenderer,
    })
  );

  yRenderer.labels.template.setAll({
    fontSize: axisFontSize,
  });

  // Series
  numericKeys.forEach((valueKey) => {
    // This part is already correct for defining the tooltip content
    const tooltip = am5.Tooltip.new(root, {
      labelText:
        labelKeys.map((k) => `{${k}}`).join(" - ") +
        `\n[bold]${valueKey}: {valueY}[/]`,
      fontSize: axisFontSize,
    });

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: valueKey,
        xAxis,
        yAxis,
        valueYField: valueKey,
        categoryXField: "label",
        tooltip, 
      })
    );

    series.columns.template.setAll({
      tooltipY: 0,
      strokeOpacity: 0,
      fillOpacity: 0.8,
    });

    series.data.setAll(transformedData);
  });

  // Legend

  chartRef.current = chart;
  return () => root.dispose();
}, [chartId, data, x, y, title, containerWidth]);

  return (
    <div
      id={chartId}
      style={{ width, height }}
      className="select-text"
    />
  );
};

export default DynamicBarChart;
