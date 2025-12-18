"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

/**
 * DynamicRadarChart
 * props:
 *   - data: array of objects (user-provided JSON)
 *   - chartId: optional id (not required, we use ref)
 *   - height: optional px height
 *
 * Works with:
 *  - time-based data (detects date-like field -> uses DateAxis)
 *  - category-based data (detects a string field or uses generated category)
 */
const DynamicRadarChart = ({ data, chartId = "radarchartdiv", height = 500 }) => {
  const containerRef = useRef(null);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // simple guard
    if (!containerRef.current) return;
    if (!data || !Array.isArray(data) || data.length === 0) {
      // dispose any existing chart if no data
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
      console.warn("DynamicRadarChart: no data or empty array passed.");
      return;
    }

    // Dispose previous chart if it exists (rebuild on data change)
    if (rootRef.current) {
      try {
        rootRef.current.dispose();
      } catch (e) {
        /* ignore */
      }
      rootRef.current = null;
    }

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
      })
    );

    const cursor = chart.set(
      "cursor",
      am5radar.RadarCursor.new(root, { behavior: "zoomX" })
    );
    cursor.lineY.set("visible", false);

    // -------- detect fields & mode ----------
    const first = data[0];
    const keys = Object.keys(first);

    // helper: find date-like field (name or parsable values)
    function detectDateField(item) {
      // prefer name based
      for (const k of Object.keys(item)) {
        if (/date|time|timestamp|ts|month|day/i.test(k)) return k;
      }
      // prefer actual Date objects or parseable strings / large numbers
      for (const k of Object.keys(item)) {
        const v = item[k];
        if (v instanceof Date) return k;
        if (typeof v === "number" && v > 1e10) return k; // likely ms timestamp
        if (typeof v === "string") {
          const d = new Date(v);
          if (!isNaN(d.valueOf())) return k;
        }
      }
      return null;
    }

    const dateField = detectDateField(first);

    // detect categoryField (string) only used if no dateField
    const detectCategoryField = (item) => {
      for (const k of Object.keys(item)) {
        if (typeof item[k] === "string") return k;
      }
      return null;
    };

    let mode = "category"; // fallback
    if (dateField) mode = "date";

    // Decide which keys are numeric value series (allow numeric strings)
    const valueFields = keys.filter((k) => {
      if (k === dateField) return false;
      // we'll check each row to ensure this column can be converted to a number
      return data.every((row) => {
        const v = row[k];
        if (v === null || v === undefined || v === "") return false;
        if (typeof v === "number") return true;
        if (typeof v === "string") return !isNaN(Number(v));
        return false;
      });
    });

    if (valueFields.length === 0) {
      console.warn("DynamicRadarChart: no numeric fields detected to create series.", keys);
    }

    // Prepare transformed data (do not mutate original)
    const transformed = data.map((row, idx) => {
      const copy = { ...row };
      // ensure numeric conversion for value fields
      for (const f of valueFields) {
        const v = copy[f];
        copy[f] = typeof v === "number" ? v : Number(v);
      }

      if (mode === "date") {
        // convert date to ms timestamp and put into __date (safe internal name)
        let val = copy[dateField];
        if (val instanceof Date) val = val.getTime();
        else if (typeof val === "string") {
          const d = new Date(val);
          val = isNaN(d.valueOf()) ? null : d.getTime();
        } else if (typeof val === "number") {
          // if value looks like seconds (10 digits) convert to ms
          if (val < 1e11) {
            // heuristic: < 1e11 likely seconds -> ms
            val = val * 1000;
          }
        } else {
          val = null;
        }
        copy.__date = val;
      } else {
        // category mode: ensure there is a category field
        // we will create __category if none found
        const catField = detectCategoryField(first);
        if (!catField) {
          copy.__category = `#${idx + 1}`;
        }
      }

      return copy;
    });

    // ---------- create axes & series ----------
    let xAxis;
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5radar.AxisRendererRadial.new(root, {}),
      })
    );

    if (mode === "date") {
      xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          maxDeviation: 0.1,
          groupData: false,
          baseInterval: { timeUnit: "month", count: 1 },
          renderer: am5radar.AxisRendererCircular.new(root, { minGridDistance: 50 }),
          tooltip: am5.Tooltip.new(root, {}),
        })
      );
    } else {
      // category mode: pick an existing string key or use __category
      const firstRow = transformed[0];
      const catKey =
        Object.keys(firstRow).find((k) => typeof firstRow[k] === "string") || "__category";

      xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: catKey,
          renderer: am5radar.AxisRendererCircular.new(root, { minGridDistance: 30 }),
        })
      );

      // CategoryAxis needs its own data array describing categories.
      // Provide unique categories in correct shape:
      const axisData = transformed.map((r) => ({ [catKey]: r[catKey] }));
      // remove duplicates just in case
      const seen = new Set();
      const unique = [];
      for (const item of axisData) {
        const v = item[catKey];
        if (!seen.has(v)) {
          seen.add(v);
          unique.push(item);
        }
      }
      xAxis.data.setAll(unique);
    }

    // create a series for each numeric field
    valueFields.forEach((field) => {
      const seriesOptions = {
        name: field,
        xAxis,
        yAxis,
        valueYField: field,
        tooltip: am5.Tooltip.new(root, { labelText: `{${field}}` }),
      };

      // pick correct "category vs date" data-field name for X
      if (mode === "date") {
        seriesOptions.valueXField = "__date";
      } else {
        // category axis requires categoryXField
        seriesOptions.categoryXField =
          Object.keys(transformed[0]).find((k) => typeof transformed[0][k] === "string") || "__category";
      }

      const series = chart.series.push(am5radar.RadarLineSeries.new(root, seriesOptions));

      // bullets
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: series.get("fill"),
          }),
        })
      );

      // set the same data to series
      series.data.setAll(transformed);
      series.appear(1000);
    });

    // appearance
    chart.appear(1000, 100);

    return () => {
      try {
        if (rootRef.current) {
          rootRef.current.dispose();
          rootRef.current = null;
        }
      } catch (e) {
        /* ignore */
      }
    };
  }, [data, chartId, height]);

  return (
    <>
      <h1> Radar Chart</h1>
      <div
        id={chartId}
        ref={containerRef}
        style={{ width: "100%", height: `${height}px` }}>
      </div>
    </>
  );
};

export default DynamicRadarChart;
