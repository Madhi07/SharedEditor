// sections/ChatPanel.jsx
import React, { Fragment } from "react";
import { FaUser } from "react-icons/fa";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { AgentZeeHead } from "@/components/SVG";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatInputArea from "../../../AgentsSection/ChatInputArea";
// import ChatInputArea from "../../AgentsSection/ChatInputArea";


export default function ChatPanel({
  chats,
  prompt,
  onPromptChange,
  onPromptSubmit,
  onKeyDown,
}) {
  return (
    <div className="bg-white p-2 pt-11 shadow-sm w-[25%] max-h-[calc(100vh-100px)] h-screen border border-gray-200">
      {/* Chat History */}
      {chats?.length > 0 ? (
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
        <div className="flex flex-col justify-center items-center text-gray-400 text-sm h-[calc(100vh-300px)]">
          <p>No chat yet. Start by entering a prompt below 👇</p>
        </div>
      )}

      {/* Input Area */}
      <ChatInputArea
        containerClassName="border border-gray-200 rounded-md p-2 shadow-md"
        inputValue={prompt}
        onInputValueChange={onPromptChange}
        onInputKeyDown={onKeyDown}
        onSendClick={onPromptSubmit}
        inputClassName="resize-none outline-0 max-h-[70px] min-h-[70px] w-[85%] no-scrollbar"
        sendButtonClassName="bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] rounded-full p-2 text-white"
      />
    </div>
  );
}
