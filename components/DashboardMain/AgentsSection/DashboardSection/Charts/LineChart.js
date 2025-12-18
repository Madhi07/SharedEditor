"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Helper function to determine font size based on chart width
const getFontSize = (width) => {
    // These breakpoints ensure the font size scales reasonably
    const numericWidth = typeof width === 'number' ? width : parseFloat(width) || 380;

    if (numericWidth >= 900) return { label: 16, title: 18, chartTitle: 22 };
    if (numericWidth >= 700) return { label: 14, title: 16, chartTitle: 20 };
    if (numericWidth >= 500) return { label: 12, title: 14, chartTitle: 18 };
    return { label: 10, title: 12, chartTitle: 16 }; // Default for smaller sizes
};

const DynamicLineChart = ({ chartId = "linechartdiv", data, width, height, title, x, y }) => {
    const chartRef = useRef(null);
    
    // Get numeric width for responsive font size calculation
    const chartWidth = typeof width === 'number' ? width : parseFloat(width) || 380;
    
    // Get responsive font sizes
    const { label: labelSize, title: titleSize, chartTitle: chartTitleSize } = getFontSize(chartWidth);

    useLayoutEffect(() => {
        if (!data || data.length === 0) return;

        // --- Data Field Handling ---
        // Ensure categoryField (x) and valueField (y) are correctly identified.
        // The data comes from your backend, often requiring cleaning.
        let categoryField = x?.toLowerCase()?.replace(/ /g, "_") || 'category';
        let valueField = y?.toLowerCase()?.replace(/ /g, "_") || 'value';
        
        // --- AmCharts Setup ---
        const root = am5.Root.new(chartId);
        if (root._logo) root._logo.dispose();
        root.setThemes([am5themes_Animated.new(root)]);

        // 💥 FIX 1: Add extra padding for the Y-axis title to prevent cut-off
        root.paddingLeft = 50; 
        
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout,
                // Ensure padding at the bottom for X-axis title
                paddingBottom: 20 
            })
        );
        
        // Create user-friendly titles from the field names (e.g., 'total_payment_volume' -> 'Total Payment Volume')
        const cleanedCategoryTitle = x ? x.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Category';
        const cleanedValueTitle = y ? y.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Value';


        // Chart Title (from the chart prop)
        if (title) {
            chart.children.unshift(am5.Label.new(root, {
                text: title,
                fontSize: chartTitleSize,
                fontWeight: "bold",
                textAlign: "center",
                x: am5.p50,
                centerX: am5.p50,
                paddingBottom: 20
            }));
        }

        // 1. X Axis (Category Axis)
        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: categoryField,
                renderer: am5xy.AxisRendererX.new(root, { 
                    minGridDistance: 30,
                }),
                tooltip: am5.Tooltip.new(root, {}),
                
                // 💥 FIX 2: Set X-axis title correctly with responsive font size
                title: am5.Label.new(root, {
                    text: cleanedCategoryTitle,
                    fontSize: titleSize, 
                    fontWeight: "bold",
                    marginTop: 15, // Push title down below labels
                })
            })
        );
        
        // Data setting needs to happen AFTER the category field is confirmed
        xAxis.data.setAll(data);

        // X-axis labels with responsive font size
        xAxis.get("renderer").labels.template.setAll({
            fontSize: labelSize, 
            rotation: -45,
            maxWidth: 100,
            oversizedBehavior: "wrap",
            textAlign: "center"
        });

        // 2. Y Axis (Value Axis)
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, { opposite: false }),
                
                // 💥 FIX 3: Set Y-axis title correctly with responsive font size
                title: am5.Label.new(root, {
                    text: cleanedValueTitle,
                    fontSize: titleSize, 
                    rotation: -90, // Crucial for vertical axis title
                    fontWeight: "bold",
                    x: -20 // Adjust title position leftward if needed
                })
            })
        );

        // Y-axis labels with responsive font size
        yAxis.get("renderer").labels.template.setAll({
            fontSize: labelSize, 
        });

        // 3. Line Series
        const series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: cleanedValueTitle,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: valueField,
                categoryXField: categoryField,
                stroke: am5.color(0x4a90e2),
                fill: am5.color(0x4a90e2),
                tooltip: am5.Tooltip.new(root, {
                    labelText: `[bold]${cleanedCategoryTitle}:[/]{${categoryField}}\n[bold]${cleanedValueTitle}:[/]{${valueField}}`
                })
            })
        );

        series.strokes.template.setAll({ strokeWidth: 2 });
        series.fills.template.setAll({ visible: true, fillOpacity: 0.3 });
        series.data.setAll(data);
        
        // 4. Cursor (optional but nice)
        chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));


        chartRef.current = root;

        // 💥 FIX 5: Rerun effect on width/height change to redraw chart with new size/fonts
        return () => root.dispose();
    }, [data, chartId, title, x, y, width, height]); 

    return (
        // The container needs the numeric width/height passed from SortableChart
        <div id={chartId} style={{ width: width, height: height }} />
    );
};

export default DynamicLineChart;