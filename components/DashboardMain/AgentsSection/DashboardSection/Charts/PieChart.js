"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicPieChart = ({ chartId = "piechartdiv", data, width = "100%", height = "400px" }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    if (root._logo) root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string") || keys[0];
    const valueField = keys.find((k) => typeof data[0][k] === "number") || keys[1];

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        categoryField,
        valueField,
        tooltip: am5.Tooltip.new(root, {
          labelText: `{${categoryField}}: {${valueField}}`,
        }),
        radius: am5.percent(100),
        innerRadius: am5.percent(0),
        calculatePercent: true,
        // alignLabels: false,
      })
    );

    series.data.setAll(data);
    series.appear(1000, 100);

    chartRef.current = root;

    // ✅ ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      root.resize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      root.dispose();
    };
  }, [data, chartId]);

  return <div ref={containerRef} id={chartId} style={{ width, height }} />;
};

export default DynamicPieChart;
