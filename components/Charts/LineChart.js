import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function LineChart({
    data = [],
    valueXField = "",
    valueYField = "",
    xAxisType = "category"
}) {
    const chartRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        const root = am5.Root.new(chartRef.current);
        root.setThemes([am5themes_Animated.new(root)]);
        root._logo?.dispose?.();

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true
            })
        );

        // === Create xAxis based on type ===
        let xAxis;
        if (xAxisType === "date") {
            xAxis = chart.xAxes.push(
                am5xy.DateAxis.new(root, {
                    baseInterval: { timeUnit: "day", count: 1 },
                    renderer: am5xy.AxisRendererX.new(root, {}),
                })
            );
        } else if (xAxisType === "category") {
            xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    categoryField: valueXField,
                    renderer: am5xy.AxisRendererX.new(root, {}),
                })
            );
        } else if (xAxisType === "value") {
            xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererX.new(root, {}),
                })
            );
        }

        xAxis.get("renderer").labels.template.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000"
        });
        xAxis.get("renderer").grid.template.setAll({
            stroke: isDarkMode ? "#a0a0b0" : "#4a4a5a"
        });

        // === yAxis ===
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );
        yAxis.get("renderer").labels.template.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000"
        });
        yAxis.get("renderer").grid.template.setAll({
            stroke: isDarkMode ? "#a0a0b0" : "#4a4a5a"
        });

        // === Series ===
        const series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Series",
                xAxis,
                yAxis,
                valueYField,
                ...(xAxisType === "date" && { valueXField }),
                ...(xAxisType === "category" && { categoryXField: valueXField }),
                ...(xAxisType === "value" && { valueXField }),
                stroke: "#ff3a8c",
                tooltip: am5.Tooltip.new(root, {
                    labelText:
                        xAxisType === "date"
                            ? "Date: {valueX.formatDate('dd-MM-YYYY')}\nValue: {valueY}"
                            : "X: {categoryX}\nY: {valueY}",
                    getFillFromSprite: false,
                    autoTextColor: false
                })
            })
        );

        series.strokes.template.setAll({ strokeWidth: 2 });
        series.get("tooltip").get("background").setAll({
            fill: isDarkMode ? "#0d0d12" : "#F0F0F0",
            fillOpacity: 1
        });
        series.get("tooltip").label.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000",
            fontSize: 14,
            fontWeight: "400"
        });

        const cursor = chart.set(
            "cursor",
            am5xy.XYCursor.new(root, {
                behavior: "zoomX"
            })
        );
        cursor.lineY.set("visible", false);
        cursor.lineX.set("visible", false);
        cursor.set("snapToSeries", [series]);

        // === Set data ===
        series.data.setAll(data);
        if (xAxisType === "category") {
            xAxis.data.setAll(data); // needed for category axis
        }

        series.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data, isDarkMode]);

    return <div ref={chartRef} className="w-full h-full" />;
}
