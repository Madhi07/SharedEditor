"use client";
import { Fragment, useState, useEffect, useRef, unstable_startGestureTransition } from "react";
import DatePicker from "react-datepicker";
import { format, parse, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { FaCalendar, FaPaperPlane, FaPlus, FaCheck } from "react-icons/fa";
import DashboardSwitcher from "./DashboardSwitch";
import { Resizable } from "re-resizable";
import { IoResize } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { BsCheck } from "react-icons/bs";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { dashboard, dashboardChatSession, dashboardNewSession } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import AddTitle from "./SetTitle";
import { FaUser } from "react-icons/fa";
import { AgentZeeHead } from "@/components/SVG";
import clsx from "clsx";
import DashboardComponent from "./Dashboard";


// ---- Dynamic chart imports ----
const StackedBarChart = dynamic(() => import("./Charts/StackedBarChat"), { ssr: false });
const VerticalBarChart = dynamic(() => import("./Charts/VerticalBarChart"), { ssr: false });
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
const LiquidGaugeChart = dynamic(() => import("./Charts/LiquidGauge"), { ssr: false });
const VenDiagram = dynamic(() => import("./Charts/VenDigram"), { ssr: false });
const DonutChart = dynamic(() => import("./Charts/DonurtChart"), { ssr: false });
const Heatmap = dynamic(() => import("./Charts/HeatMap"), { ssr: false });
const SankeyChart = dynamic(() => import("./Charts/SankeyChart"), { ssr: false });

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

function SortableChart({ chart, index, onResize, selectedCharts, setSelectedCharts }) {
  const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } =
    useSortable({ id: chart.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const ChartComponent = chartComponents[chart.type];
  if (!ChartComponent) return null;

  const [isHover, setIsHover] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState({
    width: chart.width || 400,
    height: chart.height || 380,
  });

  useEffect(() => {
    if (!isResizing) {
      setCurrentSize({
        width: chart.width || 400,
        height: chart.height || 380,
      });
    }
  }, [chart.width, chart.height, isResizing]);

  const isSelected = selectedCharts.includes(chart.id);

  return (
    <div ref={setNodeRef} style={style} className="flex items-start justify-start">
      <Resizable
        size={{ width: currentSize.width, height: currentSize.height }}
        defaultSize={{ width: chart.width || 400, height: chart.height || 380 }}
        minWidth={280}
        minHeight={250}
        enable={{ bottomRight: true }}
        onResizeStart={() => setIsResizing(true)}
        onResize={(e, direction, ref) => {
          setCurrentSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        }}
        onResizeStop={(e, direction, ref) => {
          onResize(chart.id, ref.offsetWidth, ref.offsetHeight);
          setTimeout(() => setIsResizing(false), 50);
        }}
        // 💄 Added p-3 and overflow fix
        className={`relative border rounded-lg shadow-sm  flex flex-col transition-all duration-200 ${isSelected ? "bg-blue-200" : "border-gray-300"
          } p-2 overflow-hidden`}
      >
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => {
            setSelectedCharts((prev) =>
              prev.includes(chart.id)
                ? prev.filter((id) => id !== chart.id)
                : [...prev, chart.id]
            );
          }}
          className="w-full h-full flex flex-col px-5 pt- pb-10"
        >
          {/* Header (drag handle) */}
          <div
            ref={setActivatorNodeRef}
            {...(!isResizing ? listeners : {})}
            {...attributes}
            className="px-3 py-2 font-semibold text-sm text-gray-700 cursor-grab active:cursor-grabbing select-none text-center"
          >
            {chart.title}
          </div>

          {/* Chart container */}
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0">
              <ChartComponent
                data={chart.data}
                chartId={`${chart.type}-chart-${index}`}
                width={currentSize.width}
                height={currentSize.height - 70}
                x={chart.x ?? null}
                y={chart.y ?? null}
              />
            </div>
          </div>
        </div>

        {/* Resize indicator */}
        {(isHover || isResizing) && (
          <div className="absolute bottom-1 right-1 flex items-center gap-1 text-gray-500 bg-white/80 p-1 rounded-sm text-xs select-none">
            {isResizing ? (
              <span className="font-medium text-gray-700">
                {currentSize.width}x{currentSize.height}
              </span>
            ) : (
              <IoResize className="w-4 h-4" />
            )}
          </div>
        )}

        {isSelected && (
          <div className="flex items-center gap-1.5 p-2 absolute top-2 right-2">
            <div className="ml-auto flex items-center gap-3">
              <button
                id="bg-composer-submit-btn"
                className="bg-green-500 rounded-full p-1 text-white"
              >
                <BsCheck className="min-w-[22px] max-w-[22px] min-h-[22px] max-h-[22px]" />
              </button>
            </div>
          </div>
        )}
      </Resizable>
    </div>
  );
}


export default function DashboardSectionNew() {
  const { loginUser } = useAuthContext();
  const router = useRouter();
  const [showNewDashboardPopup, setShowNewDashboardPopup] = useState(true);
  const [showEditPanelPopup, setShowEditPanelPopup] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [chatSession, setChatSession] = useState([])
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [sessionId, setSessionId] = useState(null)
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  // State for selected charts remains as an array of IDs for simplicity in UI logic
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('')
  const [showAsset, setShowAsset] = useState(false)
  const [assets, setAssets] = useState([]);
  const [assetsTitle, setAssetsTitle] = useState('');

  const exportPopupRef = useRef(null);

  useOutsideClick(exportPopupRef, () => setShowExportPopup(false));

  const GetChatSession = async () => {
    // Only fetch sessions if the "New Dashboard" popup is not active

    setLoading(true)
    try {
      const response = await retrieveOrRemove("GET", dashboardChatSession, true);
      const resData = await response?.json();


      if (!resData || resData.length === 0) {
        setLoading(false)
        setShowSessionPopup(true);
      } else {
        setLoading(false)
        setChatSession(resData);
        if (sessionId) {
          GetDashboardId(sessionId)
        }
        setShowSessionPopup(false);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };


  const fetchAssets = async (id) => {
    if (id !== null) {

      setLoading(true);
      const response = await retrieveOrRemove("GET", `/agent/dashboard/${id}/with_assets/`, true);
      let resData = null;
      try {
        resData = await response?.json();
      }
      catch (e) { }
      setAssets(resData?.assets);
      setAssetsTitle(resData.name)
      // Ensure array structure
      setLoading(false);
    }
  };

  const GetDashboardId = async () => {
    if (sessionId !== null) {

      try {
        const response = await retrieveOrRemove("GET", `/agent/dashboard/?chat_session_id=${sessionId}`, true);
        const resData = await response?.json();
        if (resData[0]?.id) {
          fetchAssets(resData[0]?.id)
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    }
  };



  const ChatConversation = async () => {
    if (sessionId) {
      // setLoading(true)
      const response = await retrieveOrRemove("GET", `${dashboardChatSession}${sessionId}/with_conversations/`, true)
      let resData = null;
      try {
        resData = await response?.json();
      }
      catch (e) { }
      if (resData?.status == 200) {

        // setLoading(false)
        if (resData.data?.conversations) {
          setChats(resData.data.conversations)
        }
        if (resData.data?.chat_assets) {
          setData(resData.data?.chat_assets);

        }
      }

    }
  }
  const NewChatSession = async () => {
    const bodyData = { title: "Dashboard" }
    const response = await createOrUpdate(bodyData, "POST", dashboardChatSession, true)
    let resData = null;
    try {
      resData = await response?.json();
    }
    catch (e) { }
    // console.log("*************** dashboard", resData.status_code)
    if (resData?.company) {
      setSessionId(resData.id)
      setShowSessionPopup(false)
    }
  }



  const Chat = async () => {
    setLoading(true);
    const bodyData = {
      question: prompt,
      chat_id: sessionId,
      company_id: loginUser?.company_profile_id,
    };

    const res = await createOrUpdate(bodyData, "POST", dashboardNewSession, true);

    try {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const chartsBuffer = []; // Store charts until finished

      const processLine = async (line) => {
        if (!line.startsWith("data: ") && !line.startsWith("response: ")) return;

        try {
          const jsonStr = line.startsWith("data: ") ? line.slice(6) : line.slice(10);
          const parsed = JSON.parse(jsonStr);

          if (parsed.data?.chat_assets) {
            chartsBuffer.push(...parsed.data.chat_assets); // collect charts
          }
        } catch (err) {
          console.warn("JSON parse error:", err.message, line);
        }
      };

      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();
          for (const line of lines) await processLine(line);
        }
      };

      await readStream();

      // ✅ Update data once all charts are collected
      if (chartsBuffer.length > 0) {
        setData(prev => ([...prev, ...chartsBuffer]));
      }

      setPrompt("");
      setLoading(false);
    } catch (e) {
      console.error("Streaming error:", e);
      setLoading(false);
    }
  };



  useEffect(() => {
    console.log("************************************ 002", data)
  }, [data]);

  useEffect(() => {
    GetChatSession();
  }, []);

  useEffect(() => {
    if (sessionId !== null) {
      ChatConversation()

      GetDashboardId(sessionId)

    }
  }, [sessionId])

  // ====================================================================
  // 💥 CORRECTED: Function to handle tile creation with required object format
  // ====================================================================
  const handleAddTile = async () => {
    // 1. Filter the main 'data' array to get the full objects for selected charts
    // 2. Map these objects to the required structure, including the 1-based order_number
    const chartsToAttach = data
      .filter(chartItem => selectedCharts.includes(chartItem.id))
      .map(chartItem => {
        // Find the index in the current 'data' array (0-based)
        const order_number_index = data.findIndex(d => d.id === chartItem.id);

        return {
          id: chartItem.id,
          title: chartItem.title,
          height: chartItem.height || 360,
          width: chartItem.width || 380,
          order_number: order_number_index + 1,
        };
      });

    const bodyData = {
      chat_session_id: sessionId,
      name: input,
      chat_assets_to_attach: chartsToAttach
    }

    const response = await createOrUpdate(bodyData, "POST", dashboard, true)
    let resData = null;
    try {
      resData = await response?.json();
    }
    catch (e) { }
    if (resData.status === 201) {
      setShowExportPopup(false);
      setSelectedCharts([]);
      fetchAssets(resData?.data?.id)

    }
  }

  // ====================================================================
  // Date Pickers


  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleResize = (id, newWidth, newHeight) => {
    setData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, width: newWidth, height: newHeight } : c
      )
    );
  };

  // Input Handling
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      Chat()
      // fetchData();
      // DashboardChat("continue")
    }
  };
  const handleInputChange = (e) => setPrompt(e.target.value);

  return (
    <Fragment>
      <div className="p-4">
        <div className={`${showNewDashboardPopup || showEditPanelPopup ? "flex gap-2" : ""}`}>
          {/* ---- Chart Area ---- */}
          <div
            className={`${showNewDashboardPopup || showEditPanelPopup ? "w-[75%]" : "w-full"
              } border border-gray-200 max-h-[calc(100vh-120px)] min-h-[calc(100vh-100px)] overflow-x-hidden`}
          >
            {/* ---- Top Bar ---- */}
            <div className="flex justify-between items-center p-3">
              <div className="flex gap-3 ">
                <div>

                  <DashboardSwitcher sessionData={chatSession} chatId={setSessionId} />
                </div>
                <div>
                  <button
                    className="inline-flex gap-3 items-center border border-gray-200 bg-white px-3 py-1"
                    onClick={() => {
                      setShowNewDashboardPopup(true);
                      setSessionId(null)
                      setData([]);
                      setChats([])
                      setShowEditPanelPopup(false);
                      setSelectedChart(null);
                      setPrompt("");
                      NewChatSession()
                    }}
                  >
                    <FaPlus className="w-3 h-3" />
                    New
                  </button>
                </div>
                <div>
                  <button
                    className="inline-flex gap-3 items-center border border-gray-200 bg-white px-3 py-1"
                    onClick={() => {
                      setShowAsset(true)
                      // setShowNewDashboardPopup(true);
                      // setSessionId(null)
                      // setData([]);
                      // setChats([])
                      // setShowEditPanelPopup(false);
                      // setSelectedChart(null);
                      // setPrompt("");
                      // NewChatSession()
                    }}
                  >

                    View Assets
                  </button>
                </div>
              </div>
              {/* <div className="flex items-center justify-between gap-2">
			                {[{ date: fromDate, type: "from" }, { date: toDate, type: "to" }].map(
			                   ({ date, type }) => (
			                     <DatePicker
			                       key={type}
			                       showIcon
			                       selected={parse(date, "dd-MM-yyyy", new Date())}
			                       onChange={(d) => onDateChange(format(d, "dd-MM-yyyy"), type)}
			                       className="w-full flex-shrink-0 bg-white rounded-lg p-2 text-sm text-gray-700 cursor-pointer outline-none border border-gray-200 focus:border-primary"
			                       calendarClassName="bg-white rounded-lg border border-gray-200 shadow-lg"
			                       dayClassName={(d) => calendarDayClass(format(d, "dd-MM-yyyy"), date)}
			                       icon={<FaCalendar />}
			                       dateFormat={"dd-MM-yyyy"}
			                     />
			                   )
			                )}
			              </div> */}
            </div>
            <hr className="w-full border-t border-secondary my-2" />

            {loading && (
              <div className="flex items-center justify-center h-full">
                <LuLoaderCircle className="size-8 animate-spin text-gradient-to-r from-primary to-secondary" />
              </div>
            )}

            {/* ---- Chart Grid ---- */}
            {!loading && data.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={data.map((d) => d.id)} strategy={rectSortingStrategy}>
                  <div
                    className="
          relative
          flex flex-wrap
          gap-4
          p-2
          justify-items-start
          
        "
                  >
                    {data.map((chartItem, i) => (
                      <Fragment>
                        {console.log("******************************* 9900 chart", chartItem)}
                        <SortableChart
                          key={chartItem.id}
                          chart={{
                            id: chartItem.id,
                            type: chartItem.default_chart_type,
                            data: chartItem.chart_data.data,
                            title: chartItem.chart_data.title,
                            width: chartItem.width,
                            height: chartItem.height,
                            x: chartItem.chart_data?.x_axis ?? null,
                            y: chartItem.chart_data?.y_axis ?? null
                          }}
                          index={i}
                          onResize={handleResize}
                          selectedCharts={selectedCharts}
                          setSelectedCharts={setSelectedCharts}
                        />
                      </Fragment>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {selectedCharts.length > 0 && (
              <button

                className="
      fixed bottom-8 left-1/2 
      transform -translate-x-1/2
      z-[50]
      px-5 py-3
      bg-gradient-to-r from-primary to-secondary
      text-white rounded-md shadow-lg
      hover:scale-105 transition-transform
    "
                onClick={() => setShowExportPopup(true)}
              >
                Export Charts
              </button>
            )}

          </div>
          {/* ---- New Dashboard Panel ---- */}
          <div
            className={`${showNewDashboardPopup ? "block" : "hidden"} bg-white p-2 pt-11  shadow-sm w-[25%] max-h-[calc(100vh-100px)] h-screen border border-gray-200`}
          >

            {chats.length > 0 ? (
              <div className="w-full flex flex-col relative overflow-y-auto mb-10  min-h-[calc(100vh-350px)] max-h-[calc(100vh-350px)] border-b border-gray-200">
                <div
                  id="conversations-area"
                  className="w-full relative p-6"
                >
                  <div className="flex flex-col gap-8 w-full ">
                    {chats?.map((item, index) => (
                      <Fragment key={index}>
                        <div className="flex items-start gap-4 md:max-w-[80%]">
                          <FaUser className="w-8 h-8 p-1.5 flex-shrink-0 object-cover rounded-full dark:bg-dark-card-primary bg-light-card-primary" />
                          <div
                            className={clsx(
                              "rounded-2xl dark:bg-dark-card-primary bg-light-card-primary rounded-tl-none dark:text-dark-text-primary text-light-text-primary"
                            )}
                          >
                            <div className="text-sm border-gray-200 shadow p-3 break-words bg-gray-50">{item?.question}</div>
                            <span className="text-xs text-gray-400 mt-2 block">
                              {format(parseISO(item?.created_at), "dd-MM-yyyy h:mm a")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 md:max-w-[80%] flex-row-reverse ml-auto">
                          <div className="w-8 h-8 rounded-full mt-1 bg-dark-card-primary inline-flex items-center justify-center flex-shrink-0">
                            <AgentZeeHead className="!size-5 !scale-x-[1] !text-white" />
                          </div>
                          {item?.answer && (
                            <div
                              className={clsx(
                                "rounded-2xl dark:bg-dark-card-primary bg-light-card-primary dark:text-dark-text-primary text-light-text-primary rounded-tr-none"
                              )}
                            >
                              <div className="text-sm mb-2 flex flex-col gap-2 border-gray-200 shadow p-3 bg-gray-50">
                                <Markdown
                                  components={{
                                    pre: ({ node, ...props }) => (
                                      <pre
                                        style={{
                                          whiteSpace: "pre-wrap"
                                        }}
                                        {...props}
                                      />
                                    )
                                  }}
                                  remarkPlugins={[remarkGfm]}
                                >
                                  {item?.answer}
                                </Markdown>
                              </div>
                              <span className="text-xs text-gray-400 block">
                                {format(parseISO(item?.created_at), "dd-MM-yyyy h:mm a")}
                              </span>
                            </div>
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // ✅ Show "No Chats" message with input below
              <div className="flex-1  overflow-y-auto min-h-[calc(100vh-300px)] max-h-[calc(100vh-300px)]">
              </div>
            )}

            <ChatInputArea
              containerClassName="border border-gray-200 rounded-md p-2 shadow-md"
              inputValue={prompt}
              onInputValueChange={handleInputChange}
              onInputKeyDown={handleKeyDown}
              onSendClick={Chat}
              inputClassName="resize-none outline-0 max-h-[70px] min-h-[70px] w-[85%] no-scrollbar"
              sendButtonClassName="bg-gradient-to-r from-primary to-secondary rounded-full p-2 text-white"
            />
          </div>
          {/* ---- Edit Panel ---- */}
          <div
            className={`${showEditPanelPopup ? "block" : "hidden"} border border-gray-200 shadow-sm w-[25%] max-h-[calc(100vh-170px)] bg-white h-screen`}
          >
            <GlobalEdit
              selectedChart={selectedChart}
              setShowEditPanelPopup={setShowEditPanelPopup}
              setShowNewDashboardPopup={setShowNewDashboardPopup}
              setSelectedChart={setSelectedChart}
            />
          </div>
        </div>
      </div>

      {/* ---- Export Popup ---- */}
      {showExportPopup && (
        <AddTitle popupRef={exportPopupRef} setShowExportPopup={setShowExportPopup} handleAddTile={handleAddTile} setInput={setInput} />
      )}

      {showAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg min-w-[calc(100vw-300px)] max-w-[calc(100vw-300px)] h-[800px] relative shadow-lg overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowAsset(false)}
            >
              ✕
            </button>
            <DashboardComponent assets={assets} title={assetsTitle} />
          </div>
        </div>
      )}
      {showSessionPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] h-[250px] relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowSessionPopup(false)}
            >
              ✕
            </button>

            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-lg text-gray-500 mb-6">
                It looks like there’s no existing dashboard chat session.
                You can create a new one to get started.
              </p>

              <button
                className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:opacity-90 transition"
                onClick={NewChatSession}
              >
                + New
              </button>
            </div>
          </div>
        </div>
      )}

    </Fragment>
  );
}