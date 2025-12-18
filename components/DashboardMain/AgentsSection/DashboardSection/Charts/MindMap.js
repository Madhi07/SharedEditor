"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const TreeChart = ({ data }) => {
  const chartDivRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartDivRef.current || !data) return;

    const root = am5.Root.new(chartDivRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const zoomableContainer = root.container.children.push(
      am5.ZoomableContainer.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        wheelable: true,
        pinchZoom: true,
      })
    );

    zoomableContainer.children.push(
      am5.ZoomTools.new(root, { target: zoomableContainer })
    );

    const series = zoomableContainer.contents.children.push(
      am5hierarchy.Tree.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 2,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    // Node rectangle
    series.nodes.template.set("makeNode", () => {
      return am5.Rectangle.new(root, {
        width: 100,
        height: 30,
        fill: am5.color(0x4a90e2),
        stroke: am5.color(0x1a237e),
        strokeWidth: 2,
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        cornerRadiusBL: 6,
        cornerRadiusBR: 6,
      });
    });

    // Labels
    series.labels.template.setAll({
      text: "{name}",
      fill: am5.color(0xffffff),
      fontSize: 12,
      oversizedBehavior: "truncate",
      maxWidth: 80,
      maxHeight: 30,
      textAlign: "center",
      centerX: am5.percent(50),
      centerY: am5.percent(50),
    });

    // -----------------------------
    // Process data to ensure it works
    // -----------------------------
    let hierarchicalData;

    // Case 1: Single node without children
    if (!Array.isArray(data) && typeof data === "object") {
      hierarchicalData = [{ ...data }];
    } 
    // Case 2: Flat array with id/parent
    else if (Array.isArray(data) && data.every(item => "id" in item)) {
      const nodesMap = {};
      const rootNodes = [];

      data.forEach(item => {
        nodesMap[item.id] = { ...item, children: [] };
      });

      data.forEach(item => {
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

      hierarchicalData = rootNodes;
    } 
    // Case 3: Already hierarchical
    else if (Array.isArray(data) && data.some(item => "children" in item)) {
      hierarchicalData = data;
    } 
    // Fallback: wrap as single root
    else {
      hierarchicalData = [{ name: "Root", children: data }];
    }

    series.data.setAll(hierarchicalData);

    return () => root.dispose();
  }, [data]);

  return (
    <>
      <h1>Mind Map</h1>
      <div ref={chartDivRef} style={{ width: "100%", height: "600px" }} />;
    </>
  );
};

export default TreeChart;
