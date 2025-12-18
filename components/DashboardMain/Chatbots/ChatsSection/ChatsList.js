import { Fragment, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendar, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { format, parse, parseISO } from "date-fns";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useDashboardContext } from "@/context/useDashboardContext";
import { FaCircleXmark } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";

export default function ChatsList({ fromDate, toDate, onDateChange, onClickSession, resMessages = {}, initialRequirements }) {

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  const { chatSessions } = useDashboardContext();

  const filteredChatSessions = useMemo(() => {
    return chatSessions.filter(session => session?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
  }, [chatSessions, searchTerm])

  const sessionId = router.query?.["session-id"] || chatSessions?.[0]?.id;

  return (
    <Fragment>
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

      <div className="mb-4 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search among ${chatSessions?.length} chats...`}
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
            className="w-full dark:bg-dark-bg-primary bg-light-bg-primary border dark:border-dark-border-primary border-light-border-primary rounded-lg px-4 py-2 text-sm dark:text-dark-text-primary text-light-text-primary pl-8 outline-none focus:!border-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        </div>
      </div>

      {resMessages?.status === "loading" && (
        <ChatSessionSkeleton />
      )}

      {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || (resMessages?.status === "ok" && chatSessions.length === 0)) && (
        <div className="rounded-xl flex flex-col items-center justify-center dark:bg-dark-bg-primary bg-light-bg-primary mx-4 p-4">
          {resMessages?.status === "err4xx" && (
            <FaCircleXmark className="text-red-400 size-6" />
          )}

          {resMessages?.status === "err5xx" && (
            <FaExclamationTriangle className="text-orange-400 size-6" />
          )}

          {(resMessages?.status === "ok" && chatSessions.length === 0) && (
            <MdOutlineSearchOff className="text-primary size-6" />
          )}

          {resMessages?.message && (
            <p className="mt-2.5 text-sm font-[500] text-center">
              {resMessages?.message}
            </p>
          )}


          <button
            onClick={async () => await initialRequirements()}
            type="button"
            className="text-sm px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500] mt-2.5"
          >
            Retry
          </button>
        </div>
      )}

      {(resMessages?.status === "ok" && chatSessions.length >= 0) && (
        <div className="space-y-2 flex-1 overflow-y-auto px-4 no-scrollbar">
          {filteredChatSessions.map((chat, index) => (
            <button
              key={chat.id}
              onClick={() => onClickSession(chat.id)}
              className={clsx("p-3 rounded-lg border w-full text-left ",
                (sessionId === chat.id) ? "xl:border-secondary xl:bg-secondary/10 bg-light-bg-primary border-light-border-primary" : "dark:bg-dark-bg-primary bg-light-bg-primary dark:border-dark-border-primary border-light-border-primary dark:hover:bg-opacity-20 hover:bg-opacity-50")}
            >
              <div className="flex items-center gap-3">
                <div className="truncate">
                  <h3 className="text-sm font-medium dark:text-dark-text-primary text-light-text-primary whitespace-nowrap text-nowrap truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs dark:text-dark-text-secondary text-light-text-secondary">
                    {format(parseISO(chat?.created_at), "dd-MM-yyyy h:mm a")}
                  </p>
                </div>
              </div>
            </button>
          ))}

        </div>
      )}

    </Fragment>
  )
}

const calendarDayClass = (date, selectedDate) => {
  const selected = date === selectedDate;
  return `!rounded ${selected ? 'from-primary to-secondary bg-gradient-to-r !text-white' : "dark:text-dark-text-secondary text-light-text-secondary dark:hover:!bg-dark-card-primary hover:!bg-card-primary"}`
}


const ChatSessionSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-2 flex-1 overflow-y-auto px-4 no-scrollbar">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={clsx("p-3 rounded-lg border w-full text-left dark:bg-dark-bg-primary bg-light-bg-primary dark:border-dark-border-primary border-light-border-primary")}
        >

          <div className="h-2.5 w-full rounded-lg dark:bg-gray-800 bg-gray-300 animate-pulse mb-1" />

          <div className="h-2.5 w-[50%] rounded-lg dark:bg-gray-800 bg-gray-300 animate-pulse" />

        </button>
      ))}
    </div>
  )
}