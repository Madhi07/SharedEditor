import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function LineChart({ data = [], valueXField = "", valueYField = "" }) {
    const chartRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        const root = am5.Root.new(chartRef.current);
        root.setThemes([am5themes_Animated.new(root)]);
        root._logo.dispose();

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
            })
        );


        const xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                maxDeviation: 0.2,
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    // minorGridEnabled: true,
                    
                }),
                // categoryField: valueXField
            })
        );

        xAxis.get("renderer").labels.template.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000"
        });

        xAxis.get("renderer").grid.template.setAll({
            stroke: isDarkMode ? "#a0a0b0" : "#4a4a5a"
        });



        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    // pan: "zoom",
                    // minorGridEnabled: true
                }),
            })
        );

        yAxis.get("renderer").labels.template.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000"
        });

        yAxis.get("renderer").grid.template.setAll({
            stroke: isDarkMode ? "#a0a0b0" : "#4a4a5a"
        });


        const series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Series",
                xAxis,
                yAxis,
                categoryXField: valueXField,
                valueYField,
                valueXField,
                stroke: "#6e3aff",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "Date: {valueX.formatDate('dd-MM-YYYY')}\nCount: {valueY}",
                    getFillFromSprite: false,
                    autoTextColor: false,
                })

            })
        );

        series.strokes.template.setAll({
            strokeWidth: 2
        });

        series.get('tooltip').get("background").setAll({
            fill: isDarkMode ? "#0d0d12" : "#F0F0F0",
            fillOpacity: 1
        });

        series.get("tooltip").label.setAll({
            fill: isDarkMode ? "#FFFFFF" : "#000000",
            fontSize: 14,
            fontWeight: "400"
        });

        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));

        cursor.lineY.set("visible", false); // optional: hide vertical line
        cursor.lineX.set("visible", false);  // optional: keep horizontal line
        cursor.set("snapToSeries", [series]); // ✅ bind cursor to line



        series.data.setAll(data);
        xAxis.data.setAll(data)
        yAxis.data.setAll(data)

        series.appear(1000);
        chart.appear(1000, 100);


        return () => {
            root.dispose();
        };
    }, [data, isDarkMode]);

    return <div id="chartdiv" ref={chartRef} className='w-full h-full' />;
}