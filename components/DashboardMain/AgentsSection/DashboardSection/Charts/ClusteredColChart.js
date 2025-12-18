"use client";
import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicMultiBarChart = ({ chartId = "multibarchartdiv", data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Detect category + value fields
    const keys = Object.keys(data[0]);
    const categoryField = keys.find((k) => typeof data[0][k] === "string");
    const valueFields = keys.filter((k) => k !== categoryField);

    // X Axis
    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(data);

    // Y Axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    // Function to create series dynamically
    function makeSeries(name, fieldName) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: categoryField,
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(data);

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
      series.appear();
    }

    // Create series for each numeric field
    valueFields.forEach((field) => makeSeries(field, field));

    chart.appear(1000, 100);
    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

   return (
    <>
      <h1>Clustered Col Chart:</h1>
      <div id={chartId} style={{ width: "100%", height: "300px" }} />;
    </>
  )
};

export default DynamicMultiBarChart;
