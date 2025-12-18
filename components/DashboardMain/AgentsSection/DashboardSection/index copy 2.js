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

export default function DashboardSection() {
    const router = useRouter();
    const [showNewDashboardPopup, setShowNewDashboardPopup] = useState(true);
    const [showEditPanelPopup, setShowEditPanelPopup] = useState(false);
    const [selectedChart, setSelectedChart] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("")
    // old get method
    // const fetchData = async () => {
    //     try {
    //         const res = await fetch(`http://13.232.217.76:8000/query/stream?query=${prompt}`, {
    //             method: "GET",
    //         });
    //         if (!res.ok) throw new Error("Stream failed");
    //         const reader = res.body.getReader();
    //         const decoder = new TextDecoder();
    //         let buffer = "";
    //         const processLine = async (line, index) => {
    //             if (!line.startsWith('data: ')) return;
    //             try {
    //                 const jsonStr = line.slice(6);
    //                 const parsed = JSON.parse(jsonStr);
    //                 setLoading(true)
    //                 if (parsed.data.chart_list) {
    //                     setData(parsed.data.chart_list)
    //                     setPrompt("")
    //                     setLoading(false)
    //                     setError(null)
    //                 }
    //             } catch (err) {
    //                 console.warn("JSON parse error:", err.message, line);
    //             }
    //         };
    //         const readStream = async () => {
    //             while (true) {
    //                 const { done, value } = await reader.read();
    //                 if (done) {
    //                     break
    //                 }
    //                 buffer += decoder.decode(value, { stream: true });
    //                 const lines = buffer.split('\n');
    //                 buffer = lines.pop();
    //                 lines.forEach((line, idx) => processLine(line, idx));
    //             }
    //         };
    //         await readStream();
    //     }
    //     catch (e) {
    //         console.error("Streaming failed", e);
    //     } finally {
    //     }
    // };

    const fetchData = async () => {
        const body = {
            session_id: 1,
            question: prompt
        }
        try {
            const res = await fetch(`http://13.232.217.76:8000/conversations/`, {
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

    const normalizeSize = (value) => {
        if (!value) return 100;

        const numeric = Number(value.toString().replace("px", ""));
        return numeric / 5;
    };

    const [charts, setCharts] = useState([]);
    useEffect(() => {
        if (data) {
            const newCharts = Array.isArray(data) ? data : [data];
            setCharts(newCharts.map((c, index) => ({
                id: c.id ?? index.toString(), // ensure unique id
                title: c.title,
                image: `http://65.0.130.35:8001/${c.path}`, // your API returns image path
                size: {
                    width: normalizeSize(c.width),
                    height: normalizeSize(c.height),
                },
                source: "API",
            })));
        }
    }, [data]);
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

    const sensors = useSensors(useSensor(PointerSensor));
    const SortableItem = memo(function SortableItem({ chart }) {
        const { attributes, listeners, setNodeRef, transform, transition } =
            useSortable({ id: chart.id });
        const style = { transform: CSS.Transform.toString(transform), transition };
        const [isHover, setIsHover] = useState(false);
        const handleClick = (e) => {
            if (e.detail === 0) return; // prevent drag click
            setShowEditPanelPopup(true);
            setShowNewDashboardPopup(false);
            setSelectedChart(chart);
        };
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="inline-block"
                onClick={handleClick}
            >
                <Resizable
                    size={chart.size}
                    onResizeStop={(e, dir, ref, d) =>
                        setCharts((prev) =>
                            prev.map((c) =>
                                c.id === chart.id
                                    ? {
                                        ...c,
                                        size: { width: c.size.width + d.width, height: c.size.height + d.height },
                                    }
                                    : c
                            )
                        )
                    }
                    handleComponent={{
                        bottomRight: (
                            <IoResize
                                className={`min-w-[18px] min-h-[18px] max-h-[18px] max-w-[18px] cursor-se-resize ${isHover ? "block rotate-90" : "hidden"
                                    }`}
                            />
                        ),
                    }}
                    enable={{ bottomRight: true }}
                    className="border border-gray-300 rounded shadow-lg bg-white"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <div
                        className={`${selectedChart?.id === chart.id ? "border-[5px] border-secondary" : ""
                            } flex flex-col p-2 h-full`}
                    >
                        <h3
                            className="text-lg font-semibold mb-2 cursor-move select-none"
                            {...attributes}
                            {...listeners}
                        >
                            {chart.title}
                        </h3>
                        <div className="relative flex-1 w-full h-full overflow-hidden">
                            <Image
                                src={chart.image} // dynamic path from API
                                alt={chart.title}
                                fill
                                className="object-contain border border-gray-200"
                            />
                        </div>
                        <p className="text-sm text-gray-500 my-2">Source: {chart.source}</p>
                    </div>
                </Resizable>
            </div>
        );
    });

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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                                if (over && active.id !== over.id) {
                                    setCharts((items) => {
                                        const oldIndex = items.findIndex((i) => i.id === active.id);
                                        const newIndex = items.findIndex((i) => i.id === over.id);
                                        return arrayMove(items, oldIndex, newIndex);
                                    });
                                }
                            }}
                        >
                            <SortableContext items={charts.map((c) => c.id)} strategy={rectSortingStrategy}>
                                <div className="flex flex-wrap gap-3">
                                    {charts.map((chart) => (
                                        <SortableItem key={chart.id} chart={chart} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
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
                                inputClassName="resize-none outline-0 max-h-[40px] no-scrollbar w-[85%]"
                                sendButtonClassName="bg-gradient-to-r from-primary to-secondary rounded-full p-2 text-white"
                            />

                            {/* <ChatInputArea containerClassName="border border-gray-200 rounded-md p-2 shadow-md" inputValue={prompt} onInputValueChange={setPrompt} onInputKeyDown={handleKeyDown} onSendClick={fetchData} inputClassName={" resize-none outline-0 no-scrollbar w-[85%] "} sendButtonClassName="bg-gradient-to-r from-primary to-secondary rounded-full p-2 text-white" /> */}
                            {/* <div className="p-2 border-t">
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center" onClick={() => { setShowNewDashboardPopup(true); setData(null); setCharts([]), setShowEditPanelPopup(false); setSelectedChart(null), setPrompt("") }}>
                                        <FaPlus />
                                    </button>
                                    <textarea
                                        rows={3}
                                        placeholder="Type your prompt..."
                                        className="flex-1 resize-none rounded-lg px-4 py-2 text-sm border outline-0 no-scrollbar"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        handleKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                fetchData();
                                            }
                                        }}
                                    />
                                    <button className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center" onClick={() => { fetchData() }}>
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div> */}
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


[{ "year": 2018, "car_count": 2 },
{ "year": 2023, "car_count": 1 },
{ "year": 2014, "car_count": 1 },
{ "year": 2025, "car_count": 2 },
{ "year": 2020, "car_count": 1 },
{ "year": 2024, "car_count": 2 },
{ "year": 2021, "car_count": 2 }]
[
    { "year": "jan", "car_count": 1 },
    { "year": "mar", "car_count": 1 },
    { "year": "oct", "car_count": 2 },
    { "year": "nov", "car_count": 1 },
    { "year": "dec", "car_count": 2 }]
[
    { "product": "Laptop", "sales": 120 },
    { "product": "Phone", "sales": 200 },
    { "product": "Tablet", "sales": 90 },
    { "product": "Monitor", "sales": 150 },
    { "product": "Headphones", "sales": 70 }
]
[
    { date: "2024-01-01", apples: 450, },
    { date: "2024-02-01", apples: 480, },
    { date: "2024-03-01", apples: 500, }]