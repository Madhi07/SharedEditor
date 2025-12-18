import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const SankeyChart = ({ chartId, data }) => {
  const chartdivRef = useRef(null);

  useLayoutEffect(() => {
    // Dispose previous root (fix hot reload / multiple mounts)
    am5.array.each(am5.registry.rootElements, function(root) {
      if (root.dom?.id === chartId) {
        root.dispose();
      }
    });

    let root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5flow.Sankey.new(root, {
        orientation: "horizontal",
        paddingRight: 64,
        paddingBottom: 64,
        nodeIdField: "from",
        linkIdField: "id",
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
      })
    );

    chart.nodes.get("colors").set("step", 2);
    chart.data.setAll(data);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return (
    <>
    <h1>SanKy Diagram:</h1>
    <div
      id={chartId}
      ref={chartdivRef}
      style={{ width: "100%", height: "600px" }}
    ></div>
    </>
  );
};

export default SankeyChart;
