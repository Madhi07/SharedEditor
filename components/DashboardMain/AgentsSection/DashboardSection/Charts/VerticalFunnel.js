"use client";
import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function DynamicFunnelChart({ chartId = "funneldChart", data }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    let root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart container
    let chart = root.container.children.push(
      am5percent.SlicedChart.new(root, {
        layout: root.verticalLayout
      })
    );

    // Auto-detect fields
    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string");
    const valueField = keys.find((k) => typeof data[0][k] === "number");

    // Create vertical FunnelSeries
    let series = chart.series.push(
      am5percent.FunnelSeries.new(root, {
        orientation: "vertical", // 🚀 vertical funnel
        alignLabels: false,
        categoryField,
        valueField,
        bottomRatio: 1
      })
    );

    // Set data
    series.data.setAll(data);

    // Animate
    series.appear();

    // Legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 15
      })
    );
    legend.data.setAll(series.dataItems);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

    return (
    <>
      <h1>Vertical Funnel Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  )
}
