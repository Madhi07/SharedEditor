"use client";
import { Fragment, useState, useEffect, memo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { LuLoaderCircle } from "react-icons/lu";


const StackedBarChart = dynamic(() => import("../Charts/StackedBarChat"), { ssr: false });
const VerticalBarChart = dynamic(() => import("../Charts/VerticalBarChart"), { ssr: false });
const HorizontalBarChart = dynamic(() => import("../Charts/HorizontalBar"), { ssr: false });
const LineChart = dynamic(() => import("../Charts/LineChart"), { ssr: false });
const ClusteredColChart = dynamic(() => import("../Charts/ClusteredColChart"), { ssr: false });
const VerticalFunnel = dynamic(() => import("../Charts/VerticalFunnel"), { ssr: false });
const PieChart = dynamic(() => import("../Charts/PieChart"), { ssr: false });
const MultiLineChart = dynamic(() => import("../Charts/MultiLineChart"), { ssr: false });
const RadarChart = dynamic(() => import("../Charts/RadarChart"), { ssr: false });
const HistogramBarChart = dynamic(() => import("../Charts/HistogramBarChart"), { ssr: false });
const DualAxisChart = dynamic(() => import("../Charts/DualAxisChart"), { ssr: false });
const MindMap = dynamic(() => import("../Charts/MindMap"), { ssr: false });
const TreemMap = dynamic(() => import("../Charts/TreemMap"), { ssr: false });
const LiquidGaugeChart = dynamic(() => import("../Charts/LiquidGauge"), { ssr: false });
const VenDiagram = dynamic(() => import("../Charts/VenDigram"), { ssr: false });
const DonutChart = dynamic(() => import("../Charts/DonurtChart"), { ssr: false });
const Heatmap = dynamic(() => import("../Charts/HeatMap"), { ssr: false });
const SankeyChart = dynamic(() => import("../Charts/SankeyChart"), { ssr: false });

// ✅ Map chart types to components
const chartComponents = {
  line_chart: LineChart,
  clusteredColChart: ClusteredColChart,
  stacked_bar_chat: StackedBarChart,
  vertical_bar_chart: VerticalBarChart,
  horizontal_bar_chart: HorizontalBarChart,
  verticalFunnel: VerticalFunnel,
  multiLineChart: MultiLineChart,
  pie_chart: PieChart,
  radar: RadarChart,
  HistogramBarChart: HistogramBarChart,
  DualAxisChart: DualAxisChart,
  TreemMap: TreemMap,
  MindMap: MindMap,
  liquidGaugeChart: LiquidGaugeChart,
  donut_chart: DonutChart,
  Heatmap: Heatmap,
  sankeychart: SankeyChart,
  VenDiagram: VenDiagram,
};

export default function DashboardComponent({ assets, title }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);




  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <LuLoaderCircle className="size-10 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <Fragment>
      <div className="p-4  py-5 h-full">
        {/* <div className="ml-3">
          <button className="px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white" onClick={(() => { router.push("/dashboard/agents/play-ground") })}>Back to Dashboard</button>
        </div> */}
        {assets.length > 0 ? (
          <Fragment>
            <h1 className="text-2xl font-bold">
              {title ? title.charAt(0).toUpperCase() + title.slice(1) : ""}
            </h1>
            <div className="flex flex-wrap gap-5  p-3 ">
              {assets?.map((asset, index) => {
                const chartAsset = asset.chat_asset;
                const ChartComponent =
                  chartComponents[chartAsset?.default_chart_type] || null;
                if (!ChartComponent) return null;

                const chartData = chartAsset?.chart_data || {};

                // ✅ Define the desired width and height for full visibility
                // Use a dynamic approach to fill the container, or use 'asset.width/height' if they exist.
                // For full visibility in a responsive container, you can set the container's width to 'auto' 
                // and the chart's width/height to the container's size.
                const containerWidth = asset.width || 600; // Increased default width
                const containerHeight = asset.height || 450; // Increased default height

                return (
                  <div
                    key={asset.id}
                    className=" rounded-lg shadow-sm bg-white dark:bg-dark-card py-5 "
                    style={{
                      // Setting w-full h-full is often not enough with flex, 
                      // better to specify explicit dimensions or percentages.
                      // Use the retrieved or default width/height here.
                      width: containerWidth,
                      height: containerHeight,
                    }}
                  >
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200 text-center w-full">
                      {asset.title || chartData?.title}
                    </h3>

                    <ChartComponent
                      data={chartData.data || []}
                      chartId={`${chartAsset.default_chart_type}-${index}`}
                      // ✅ Pass the full container dimensions minus padding/header space
                      width={containerWidth - 20} // Subtract a little for container padding
                      height={containerHeight - 50} // Subtract for header and padding
                      x={chartData.x_axis || null}
                      y={chartData.y_axis || null}
                    />
                  </div>
                );
              })}
            </div>
          </Fragment>
        )
          :
          <div className="flex items-center justify-center h-full">
            <p className="text-center  font-bold text-xl">No Assets Found...</p>
          </div>
        }
      </div>
    </Fragment>
  );

}
