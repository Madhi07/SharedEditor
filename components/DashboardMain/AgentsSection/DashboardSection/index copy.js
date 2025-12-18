import { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import { format, parse, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { FaCalendar, FaExclamationTriangle, FaPaperPlane, FaPlus, FaSearch } from "react-icons/fa";
import DashboardSwitcher from "./DashboardSwitch";
import GlobalEdit from "./EditPanel";
import Image from "next/image"
import { Resizable } from "re-resizable";


const DashboardPanelJson = [{
    "id": 1,
    "title": "Sales Distribution",
    "image": "https://quickchart.io/chart?c={type:'pie',data:{labels:['Product A','Product B','Product C'],datasets:[{data:[40,35,25]}]}}",
    "size": { "width": 400, "height": 400 },
    "aspectRatio": "1:1",
    "source": "QuickChart.io"
  },
  {
    "id": 2,
    "title": "Revenue Split",
    "image": "https://quickchart.io/chart?c={type:'doughnut',data:{labels:['North','South','East','West'],datasets:[{data:[30,25,20,25]}]}}",
    "size": { "width": 400, "height": 400 },
    "aspectRatio": "1:1",
    "source": "QuickChart.io"
  },
  {
    "id": 3,
    "title": " Monthly Visitors",
    "image": "https://quickchart.io/chart?c={type:'line',data:{labels:['Jan','Feb','Mar','Apr','May'],datasets:[{label:'Visitors',data:[120,150,170,140,180]}]}}",
    "size": { "width": 600, "height": 400 },
    "aspectRatio": "3:2",
    "source": "QuickChart.io"
  },
  {
    "id": 4,
    "title": "Traffic Sources",
    "image": "https://quickchart.io/chart?c={type:'line',data:{labels:['Jan','Feb','Mar','Apr','May'],datasets:[{label:'Organic',data:[50,60,70,80,90]},{label:'Paid',data:[30,40,35,45,50]}]}}",
    "size": { "width": 600, "height": 400 },
    "aspectRatio": "3:2",
    "source": "QuickChart.io"
  },
  {
    "id": 5,
    "title": "Product Sales",
    "image": "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'],datasets:[{label:'Sales',data:[200,300,250,400]}]}}",
    "size": { "width": 600, "height": 400 },
    "aspectRatio": "3:2",
    "source": "QuickChart.io"
  }
]


export default function DashboardSection() {
  const router = useRouter();
  const [showNewDashboardPopup, setShowNewDashboardPopup] = useState(true);
  const [showEditPanel, setShowEditPanel] = useState(true);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return router.query?.['start-date'] ? router.query?.['start-date'] : format(date, "dd-MM-yyyy");
  });

  const [toDate, setToDate] = useState(() => {
    const date = new Date();
    return router.query?.['end-date'] ? router.query?.['end-date'] : format(date, "dd-MM-yyyy");
  });
  const calendarDayClass = (date, selectedDate) => {
    const selected = date === selectedDate;
    return `!rounded ${selected ? 'from-primary to-secondary bg-gradient-to-r !text-white' : "dark:text-dark-text-secondary text-light-text-secondary dark:hover:!bg-dark-card-primary hover:!bg-card-primary"}`
  }
  const onDateChange = async (date, type = null) => {

    if (!type || !date) return;
    console.log("date 332", date, type);

  }

  return (
    <Fragment>
      <div className="p-4 ">
        <div className="flex justify-between items-center ">
          <div className="flex gap-3">
            <DashboardSwitcher />
            <button
              className="inline-flex gap-3 items-center border border-gray-200 bg-white px-3 py-1"
              onClick={() => { setShowNewDashboardPopup((prev) => !prev); setShowEditPanel(false) }}
            >
              <FaPlus className="min-w-[10px] min-h-[10px] max-w-[10px] max-h-[10px] object-contain" />
              New
            </button>

          </div>
          <div className="flex items-center gap-2 mb-4 px-4">

            <DatePicker
              showIcon
              selected={parse(fromDate, "dd-MM-yyyy", new Date())}
              onChange={(date) => onDateChange(format(date, "dd-MM-yyyy"), 'from')}
              className="w-full flex-shrink-0 dark:!bg-dark-bg-primary !bg-light-bg-primary !rounded-lg !p-2 text-sm dark:!text-dark-text-primary !text-light-text-primary cursor-pointer outline-none border dark:border-dark-border-primary border-light-border-primary focus:!border-primary"
              calendarClassName="dark:!bg-dark-bg-primary !bg-light-bg-primary !rounded-lg border dark:!border-dark-border-primary !border-light-border-primary !shadow-lg"
              dayClassName={(date) => calendarDayClass(format(date, "dd-MM-yyyy"), fromDate)}
              icon={<FaCalendar />}
              calendarIconClassName="absolute right-0 top-0.5 dark:!text-dark-text-secondary !text-light-text-secondary"
              showPopperArrow={false}
              dateFormat={"dd-MM-yyyy"}
              weekDayClassName={() => "dark:!text-dark-text-primary !text-light-text-primary"}
            />

            <DatePicker
              showIcon
              selected={parse(toDate, "dd-MM-yyyy", new Date())}
              onChange={(date) => onDateChange(format(date, "dd-MM-yyyy"), 'to')}
              className="w-full flex-shrink-0 dark:!bg-dark-bg-primary !bg-light-bg-primary !rounded-lg !p-2 text-sm dark:!text-dark-text-primary !text-light-text-primary cursor-pointer outline-none border dark:border-dark-border-primary border-light-border-primary focus:!border-primary"
              calendarClassName="dark:!bg-dark-bg-primary !bg-light-bg-primary !rounded-lg border dark:!border-dark-border-primary !border-light-border-primary !shadow-lg"
              dayClassName={(date) => calendarDayClass(format(date, "dd-MM-yyyy"), toDate)}
              icon={<FaCalendar />}
              calendarIconClassName="absolute right-0 top-0.5 dark:!text-dark-text-secondary !text-light-text-secondary"
              showPopperArrow={false}
              dateFormat={"dd-MM-yyyy"}
              weekDayClassName={() => "dark:!text-dark-text-primary !text-light-text-primary"}
            />

          </div>
        </div>
        <div className={`${showNewDashboardPopup ? 'flex gap-2' : ''}`}>
          <div className={`${showNewDashboardPopup ? 'w-[75%] ' : 'w-full'} border border-red-400 max-h-[calc(100vh-170px)] p-3 overflow-y-auto`}>
<div className="flex flex-wrap gap-3">
  {DashboardPanelJson.map((chart) => {
    const [isHover, setIsHover] = useState(false);

    return (
      <Resizable
        key={chart.id}
        defaultSize={{
          width: chart.size.width,
          height: chart.size.height,
        }}
        minWidth={200}
        minHeight={200}
        maxWidth={1000}
        maxHeight={800}
        className="border border-gray-300 rounded shadow-lg flex flex-col p-2"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        handleComponent={{
          bottomRight: (
            <div
              className={`w-4 h-4 bg-blue-500 ${
                isHover ? "block" : "hidden"
              }`}
            />
          ),
        }}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{chart.title}</h3>

        <div className="relative flex-1 w-full h-full overflow-hidden">
          <Image
            src={chart.image}
            alt={chart.title}
            fill
            className="object-contain border border-gray-200 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <p className="text-sm text-gray-500 my-3">Source: {chart.source}</p>
      </Resizable>
    );
  })}
</div>
          </div>

          <div className={`${(showNewDashboardPopup) ? 'block' : 'hidden'} border border-blue-400 w-[25%] max-h-[calc(100vh-170px)] bg-white h-screen`}>
            <div className="p-4 border-t dark:border-dark-border-primary border-light-border-primary">
              <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Your scrollable/chat content goes here */}
                <div className="flex-1 overflow-y-auto">
                </div>

                {/* Input box at bottom */}
                <div className="p- border-t dark:border-dark-border-primary border-light-border-primary">
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-lg dark:bg-dark-card-primary bg-light-card-primary flex items-center justify-center text-gray-500 border dark:border-dark-border-primary border-light-border-primary">
                      <FaPlus />
                    </button>
                    <textarea
                      rows={1}
                      placeholder="Type your prompt..."
                      className="max-h-48 flex-1 resize-none overflow-hidden dark:bg-dark-card-primary bg-light-card-primary rounded-lg px-4 py-2 text-sm border dark:border-dark-border-primary border-light-border-primary outline-none focus:!border-primary"
                    />
                    <button className="w-10 h-10 rounded-lg from-primary to-secondary bg-gradient-to-r flex items-center justify-center hover:opacity-90 text-white">
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}