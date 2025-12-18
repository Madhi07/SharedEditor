"use client";
import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicStackedBarChart = ({ chartId = "stackedchartdiv", data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);

    root.setThemes([am5themes_Animated.new(root)]);

    // Chart container
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panY",
        wheelY: "zoomY",
        layout: root.verticalLayout,
      })
    );

    // Scrollbar
    chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));

    // ✅ Detect fields
    const keys = Object.keys(data[0]);
    const categoryField = keys[0]; // first key = category (like year, month, country, etc.)
    const valueFields = keys.slice(1); // rest = numeric stacked series

    // Y Axis (category)
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yAxis.data.setAll(data);

    // X Axis (values)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
      })
    );

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );

    // Function to add series
    function makeSeries(name, fieldName) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          stacked: true,
          xAxis,
          yAxis,
          valueXField: fieldName,
          categoryYField: categoryField,
        })
      );

      series.columns.template.setAll({
        tooltipText: `{name}, {${categoryField}}: {valueX}`,
        tooltipY: am5.percent(90),
      });

      series.data.setAll(data);

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueX}",
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      );

      legend.data.push(series);
    }

    // ✅ Auto-generate stacked series
    valueFields.forEach((field) => {
      makeSeries(field.charAt(0).toUpperCase() + field.slice(1), field);
    });

    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
      <h1>StackedBar Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  )
}

export default DynamicStackedBarChart;
