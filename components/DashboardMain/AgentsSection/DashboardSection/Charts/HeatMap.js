"use client";
import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";



export default function HeatmapChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    // Y Axis
    const yRenderer = am5xy.AxisRendererY.new(root, {
      visible: false,
      inversed: true,
    });
    yRenderer.grid.template.set("visible", false);

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: yRenderer,
        categoryField: "weekday",
      })
    );

    // X Axis
    const xRenderer = am5xy.AxisRendererX.new(root, { visible: false, opposite: true });
    xRenderer.grid.template.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: "hour",
      })
    );

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        calculateAggregates: true,
        stroke: am5.color(0xffffff),
        clustered: false,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: "hour",
        categoryYField: "weekday",
        valueField: "value",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{value}",
      strokeOpacity: 1,
      strokeWidth: 2,
      width: am5.percent(100),
      height: am5.percent(100),
    });

    // Heat rules
    series.set("heatRules", [
      {
        target: series.columns.template,
        min: am5.color(0xfffb77),
        max: am5.color(0xfe131a),
        dataField: "value",
        key: "fill",
      },
    ]);

    // Heat Legend
    const heatLegend = chart.bottomAxesContainer.children.push(
      am5.HeatLegend.new(root, {
        orientation: "horizontal",
        endColor: am5.color(0xfffb77),
        startColor: am5.color(0xfe131a),
      })
    );

    series.columns.template.events.on("pointerover", (event) => {
      const di = event.target.dataItem;
      if (di) {
        heatLegend.showValue(di.get("value", 0));
      }
    });

    series.events.on("datavalidated", () => {
      heatLegend.set("startValue", series.getPrivate("valueHigh"));
      heatLegend.set("endValue", series.getPrivate("valueLow"));
    });

    // Set data
    series.data.setAll(data);

    // Extract unique categories
    const weekdays= [];
    const hours = [];
    data.forEach((row) => {
      if (!weekdays.includes(row.weekday)) weekdays.push(row.weekday);
      if (!hours.includes(row.hour)) hours.push(row.hour);
    });

    yAxis.data.setAll(weekdays.map((weekday) => ({ weekday })));
    xAxis.data.setAll(hours.map((hour) => ({ hour })));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

return(
    <>
    <h1>Heat Map</h1>
  <div ref={chartRef} style={{ width: "100%", height: "500px" }} />;
    </>
  )
}
