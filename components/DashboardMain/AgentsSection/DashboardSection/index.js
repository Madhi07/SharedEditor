"use client";
import { Fragment, useState, memo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import { useRouter } from "next/router";
import { FaCalendar, FaPaperPlane, FaPlus } from "react-icons/fa";
import DashboardSwitcher from "./DashboardSwitch";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { IoResize } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GlobalEdit from "./EditPanel";
import ChatInputArea from "./ChatInputArea";
import dynamic from "next/dynamic";


const StackedBarChart = dynamic(() => import("./Charts/StackedBarChat"), { ssr: false });
const verticalBarChart = dynamic(() => import("./Charts/VerticalBarChart"), { ssr: false });
const HorizontalBarChart = dynamic(() => import("./Charts/HorizontalBar"), { ssr: false });
const LineChart = dynamic(() => import("./Charts/LineChart"), { ssr: false });
const ClusteredColChart = dynamic(() => import("./Charts/ClusteredColChart"), { ssr: false });
const VerticalFunnel = dynamic(() => import("./Charts/VerticalFunnel"), { ssr: false });
const PieChart = dynamic(() => import("./Charts/PieChart"), { ssr: false });
const MultiLineChart = dynamic(() => import("./Charts/MultiLineChart"), { ssr: false });
const RadarChart = dynamic(() => import("./Charts/RadarChart"), { ssr: false });
const HistogramBarChart = dynamic(() => import("./Charts/HistogramBarChart"), { ssr: false });
const DualAxisChart = dynamic(() => import("./Charts/DualAxisChart"), { ssr: false });
const MindMap = dynamic(() => import("./Charts/MindMap"), { ssr: false });
const TreemMap = dynamic(() => import("./Charts/TreemMap"), { ssr: false });
const liquidGaugeChart = dynamic(() => import("./Charts/LiquidGauge"), { ssr: false });
const VenDigram = dynamic(() => import("./Charts/VenDigram"), { ssr: false });
const DonurtChart = dynamic(() => import("./Charts/DonurtChart"), { ssr: false });
const Heatmap = dynamic(() => import("./Charts/HeatMap"), { ssr: false });
const SankeyChart = dynamic(() => import("./Charts/SankeyChart"), { ssr: false });

export default function DashboardSection() {
    const router = useRouter();
    const [showNewDashboardPopup, setShowNewDashboardPopup] = useState(true);
    const [showEditPanelPopup, setShowEditPanelPopup] = useState(false);
    const [selectedChart, setSelectedChart] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("")
    const [chartType, isCharType] = useState('')

    const jsonData = [
        { chartType: "line_chart", Component: LineChart },
        { chartType: "clusteredColChart", Component: ClusteredColChart },
        { chartType: "stacked-bar-chat", Component: StackedBarChart },
        { chartType: "vertical_bar_chart", Component: verticalBarChart },
        { chartType: "horizontal_bar_chart", Component: HorizontalBarChart },
        { chartType: "verticalFunnel", Component: VerticalFunnel },
        { chartType: "multiLineChart", Component: MultiLineChart },
        { chartType: "pie_chart", Component: PieChart },
        { chartType: "radar", Component: RadarChart },
        { chartType: "HistogramBarChart", Component: HistogramBarChart },
        { chartType: "DualAxisChart", Component: DualAxisChart },
        { chartType: "TreemMap", Component: TreemMap },
        { chartType: "MindMap", Component: MindMap },
        { chartType: "liquidGaugeChart", Component: liquidGaugeChart },
        { chartType: "donut_chart", Component: DonurtChart },
        { chartType: "Heatmap", Component: Heatmap },
        { chartType: "sankeychart", Component: SankeyChart },
    ]

    const fetchData = async () => {
        setLoading(true)
        const body = {
            session_id: 1,
            question: prompt
        }
        try {
            const res = await fetch(`http://13.233.92.80:8000/conversations/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Stream failed");
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            const processLine = async (line, index) => {
                if (!line.startsWith('data: ')) return;
                try {
                    const jsonStr = line.slice(6);
                    const parsed = JSON.parse(jsonStr);
                    console.log("***************************** parsed data", parsed)
                    setLoading(true)
                    if (parsed.data.chart_list) {
                        // isCharType(parsed.data.chart_list)
                        //   const types = chartList.map(item => item.type);
                        setData(parsed.data.chart_list)
                        setPrompt("")
                        setLoading(false)
                        setError(null)
                    }
                } catch (err) {
                    console.warn("JSON parse error:", err.message, line);
                }
            };
            const readStream = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break
                    }
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop();
                    lines.forEach((line, idx) => processLine(line, idx));
                }
            };
            await readStream();
        }
        catch (e) {
            console.error("Streaming failed", e);
        } finally {
        }
    };


    const [charts, setCharts] = useState([]);

    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return router.query?.["start-date"] ?? format(date, "dd-MM-yyyy");
    });

    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        return router.query?.["end-date"] ?? format(date, "dd-MM-yyyy");
    });

    const calendarDayClass = (date, selectedDate) =>
        `!rounded ${date === selectedDate
            ? "from-primary to-secondary bg-gradient-to-r !text-white"
            : "dark:text-dark-text-secondary text-light-text-secondary dark:hover:!bg-dark-card-primary hover:!bg-card-primary"
        }`;

    const onDateChange = (date, type = null) => {
        if (!type || !date) return;
        // handle date change logic here
    };
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            fetchData();
        }
    }
    const handleInputChange = (e) => setPrompt(e.target.value);
    return (
        <Fragment>
            <div className="p-4">

                <div className={`${showNewDashboardPopup || showEditPanelPopup ? "flex gap-2" : ""}`}>

                    <div
                        className={`${showNewDashboardPopup || showEditPanelPopup ? "w-[75%]" : "w-full"
                            } border border-gray-200 max-h-[calc(100vh-120px)] min-h-[calc(100vh-100px)]  no-scrollbar overflow-x-hidden`}
                    >
                        <div className="flex justify-between items-center p-3">
                            <div className="flex gap-3">
                                <DashboardSwitcher />
                                <button
                                    className="inline-flex gap-3 items-center border border-gray-200 bg-white px-3 py-1"
                                    onClick={() => { setShowNewDashboardPopup(true); setData(null); setCharts([]), setShowEditPanelPopup(false); setSelectedChart(null), setPrompt("") }}
                                >
                                    <FaPlus className="w-3 h-3" />
                                    New
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-2  px-">
                                {[{ date: fromDate, type: "from" }, { date: toDate, type: "to" }].map(
                                    ({ date, type }) => (
                                        <DatePicker
                                            key={type}
                                            showIcon
                                            selected={parse(date, "dd-MM-yyyy", new Date())}
                                            onChange={(d) => onDateChange(format(d, "dd-MM-yyyy"), type)}
                                            className="w-full flex-shrink-0 dark:!bg-dark-bg-primary !bg-light-bg-white !rounded-lg !p-2 text-sm dark:!text-dark-text-primary !text-light-text-primary cursor-pointer outline-none border dark:border-dark-border-primary border-light-border-primary focus:!border-primary"
                                            calendarClassName="dark:!bg-dark-bg-primary !bg-light-bg-primary !rounded-lg border dark:!border-dark-border-primary !border-light-border-primary !shadow-lg"
                                            dayClassName={(d) => calendarDayClass(format(d, "dd-MM-yyyy"), date)}
                                            icon={<FaCalendar />}
                                            calendarIconClassName="absolute right-0 top-0.5 dark:!text-dark-text-secondary !text-light-text-secondary"
                                            showPopperArrow={false}
                                            dateFormat={"dd-MM-yyyy"}
                                            weekDayClassName={() => "dark:!text-dark-text-primary !text-light-text-primary"}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        <hr className="w-full border-t border-secondary my-" />

                        {loading && (
                            <div className="flex items-center justify-center h-full">
                                <LuLoaderCircle className="size-8 animate-spin text-gradient-to-r from-primary to-secondary" />
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            {data && data.map((chart, chartIndex) => {
                                const match = jsonData.find(item => item.chartType == chart.type);
                                const { Component } = match;
                                return (
                                    <div key={chartIndex} className="border border-green-950 p-4 h-[500px]">
                                        <Component
                                            data={chart.data}
                                            chartId={`${chart.type}-chart-${chartIndex}`}
                                            width={'100%'}
                                            height={'70%'}
                                        />
                                    </div>
                                );
                            })}
                        </div>


                    </div>

                    {/* New Dashboard Panel */}
                    <div className={`${showNewDashboardPopup ? "block" : "hidden"} border border-gray-200 shadow-sm w-[25%] max-h-[calc(100vh-100px)] bg-white h-screen`}>
                        <div className="px-4 flex flex-col h-[calc(100vh-110px)] ">

                            <div className="flex-1 overflow-y-auto" />

                            <ChatInputArea
                                containerClassName="border border-gray-200 rounded-md p-2 shadow-md"
                                inputValue={prompt}
                                onInputValueChange={handleInputChange}
                                onInputKeyDown={handleKeyDown}
                                onSendClick={fetchData}
                                inputClassName="resize-none outline-0 max-h-[70px]  no-scrollbar w-[85%]"
                                sendButtonClassName="bg-gradient-to-r from-primary to-secondary rounded-full p-2 text-white"
                            />

                        </div>
                    </div>
                    {/* Edit Panel */}
                    <div className={`${showEditPanelPopup ? "block" : "hidden"} border border-gray-200 shadow-sm w-[25%] max-h-[calc(100vh-170px)] bg-white h-screen`}>
                        <GlobalEdit selectedChart={selectedChart} setShowEditPanelPopup={setShowEditPanelPopup} setShowNewDashboardPopup={setShowNewDashboardPopup} setSelectedChart={setSelectedChart} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
