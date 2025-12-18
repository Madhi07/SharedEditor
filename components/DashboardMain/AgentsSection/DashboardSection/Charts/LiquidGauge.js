"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicLiquidGauge = ({ chartId = "liquidGaugeChartDiv", data }) => {
  const rootRef = useRef(null);
  const seriesRef = useRef(null);
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      // ✅ Create root only once
      const root = am5.Root.new(chartId);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          radius: am5.percent(100),
          innerRadius: am5.percent(0),
        })
      );

      const keys = Object.keys(data[0]);
      const categoryField = keys.find((k) => typeof data[0][k] === "string");
      const valueField = keys.find((k) => typeof data[0][k] === "number");

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          categoryField,
          valueField,
        })
      );

      series.slices.template.setAll({
        stroke: am5.color(0x000000),
        strokeWidth: 1,
      });

      series.slices.template.adapters.add("fill", (fill, target) => {
        return target.dataItem.dataContext[categoryField] === "filled"
          ? am5.color(0x2196f3)
          : am5.color(0xffffff);
      });

      const label = chart.seriesContainer.children.push(
        am5.Label.new(root, {
          text: "",
          fontSize: 28,
          fontWeight: "bold",
          centerX: am5.p50,
          centerY: am5.p50,
        })
      );

      // Store references
      rootRef.current = root;
      seriesRef.current = series;
      labelRef.current = label;
    }

    // ✅ Update series data dynamically
    const series = seriesRef.current;
    const label = labelRef.current;
    series.data.setAll(data);

    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string");
    const valueField = keys.find((k) => typeof data[0][k] === "number");

    const filledValue =
      data.find((d) => d[categoryField] === "filled")?.[valueField] ?? 0;
    label.set("text", `${filledValue} %`);

    return () => {
      // Dispose root only on unmount
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, chartId]);

  return (
    <>
      <h1>Liquid Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  )
};

export default DynamicLiquidGauge;
