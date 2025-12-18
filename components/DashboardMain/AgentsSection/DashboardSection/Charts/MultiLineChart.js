"use client";
import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function DynamicLineChart({ chartId = "chartdiv", data }) {
  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    // Dispose old root if exists
    if (am5.registry.rootElements) {
      am5.registry.rootElements.forEach((root) => {
        if (root.dom.id === chartId) {
          root.dispose();
        }
      });
    }

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    // Chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      })
    );

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginBottom: 20,
      })
    );

    // Auto-detect fields
    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string");
    const valueFields = keys.filter((k) => typeof data[0][k] === "number");

    // X Axis (Months)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );
    xAxis.data.setAll(data);

    // Y Axis (Values)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create line series dynamically
    valueFields.forEach((field) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: field,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: categoryField,
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}",
          }),
        })
      );

      // Line style
      series.strokes.template.setAll({
        strokeWidth: 2,
      });

      // Add circle bullets
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: series.get("fill"),
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
          }),
        })
      );

      // ✅ Add labels above bullets (real values, not {valueY})
      series.bullets.push((root, series, dataItem) => {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: dataItem.get("valueY")?.toString() ?? "",
            centerY: am5.percent(100),
            dy: -15,
            fontSize: 12,
          }),
        });
      });

      series.data.setAll(data);
    });

    // Add legend
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
      <h1>Multi Line Chart</h1>
      <div id={chartId} className="w-full h-[450px]" />
    </>
  )
}
