"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicPieChart = ({ chartId = "piechartdiv", data, width, height, title }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose(); // remove logo
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Detect category + value field
    const keys = Object.keys(data[0]);
    const categoryField = keys.find(
      (k) => typeof data[0][k] === "string"
    ) || keys[0];
    const valueField = keys.find((k) => typeof data[0][k] === "number") || keys[1];

    // Pie series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField,
        
        innerRadius: am5.percent(70), // full pie
        valueField,
        tooltip: am5.Tooltip.new(root, { 
          labelText: `{${categoryField}}: {${valueField}}` 
        }),
        alignLabels: false, // allow manual label positioning
      })
    );

    // ----------------------------
    // Circular labels close to slices
    // ----------------------------
series.labels.template.adapters.add("fontSize", (fontSize, target) => {
  if (!target || !target.dataItem) return fontSize; // fallback

  const sliceAngle = target.dataItem.get("endAngle") - target.dataItem.get("startAngle");
  if (sliceAngle < 10) return 10;  // smaller font for tiny slices
  if (sliceAngle < 20) return 11;  
  return 12; // default font
});

series.labels.template.adapters.add("radius", (radius, target) => {
  if (!target || !target.dataItem) return radius; // fallback

  const sliceAngle = target.dataItem.get("endAngle") - target.dataItem.get("startAngle");
  if (sliceAngle < 10) return 40; // move tiny slices further out
  if (sliceAngle < 20) return 30;
  return 20; // default radius
});

series.ticks.template.setAll({ forceHidden: false }); // show tick lines for tiny slices


    // Set data
    series.data.setAll(data);

    // Animate
    series.appear(1000, 100);

    chartRef.current = root;

    return () => root.dispose();
  }, [data, chartId]);

  return <div id={chartId} style={{ width, height }} />;
};

export default DynamicPieChart;
