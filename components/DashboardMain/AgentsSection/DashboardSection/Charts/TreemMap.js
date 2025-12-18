"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DynamicTreemapChart = ({ chartId = "treemapdiv", data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!data) return;

    // Dispose any previous root
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    // Create container
    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    // Create Treemap series
    const series = container.children.push(
      am5hierarchy.Treemap.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: 0,
        initialDepth: 1,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    // Style
    series.rectangles.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
    });

    series.labels.template.setAll({
      fontSize: 14,
      fill: am5.color(0xffffff),
      centerX: am5.p50,
      centerY: am5.p50,
    });

    // ✅ Function to convert flat data to hierarchy
    const buildHierarchy = (flatData) => {
      const nodesMap = {};
      const rootNodes = [];

      flatData.forEach(item => {
        nodesMap[item.id] = { ...item, children: [] };
      });

      flatData.forEach(item => {
        if (item.parent) {
          if (nodesMap[item.parent]) {
            nodesMap[item.parent].children.push(nodesMap[item.id]);
          } else {
            rootNodes.push(nodesMap[item.id]);
          }
        } else {
          rootNodes.push(nodesMap[item.id]);
        }
      });

      return rootNodes;
    };

    // Determine if data is hierarchical or flat
    let hierarchicalData;
    if (data.length === 1 && data[0].children) {
      // Already hierarchical
      hierarchicalData = data;
    } else if (data.every(item => "id" in item)) {
      // Flat data with id/parent
      hierarchicalData = buildHierarchy(data);
    } else {
      console.error("Unsupported data format for Treemap");
      return;
    }

    // Set hierarchical data
    series.data.setAll(hierarchicalData);

    // Start with root selected
    series.set("selectedDataItem", series.dataItems[0]);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
      <h1>Team Map / Treemap:</h1>
      <div id={chartId} style={{ width: "100%", height: "400px" }} />;
    </>
  );
};

export default DynamicTreemapChart;
