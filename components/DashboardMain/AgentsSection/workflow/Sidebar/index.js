import { Fragment } from "react";
import { X } from "lucide-react";
import { useFlow } from "@/context/FlowContext";
import SidebarOptions from "./MenuOptions/Trigger";
import ActionSidebar from "./MenuOptions/Actions";

export default function Sidebar() {
  const { sidebarOptions, closeSideBar } = useFlow();

  return (
    <Fragment>
      <div
        className={`fixed right-0 top-0 w-80 h-screen
          bg-white border-l border-gray-200 shadow-xl
          transform transition-transform duration-500 ease-in-out
          z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
          ${sidebarOptions.show ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <h2 className="text-gray-800 text-lg font-semibold tracking-wide">
            {sidebarOptions.type === "trigger" ? "Triggers" : "Actions"}
          </h2>
          <button
            onClick={closeSideBar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="px-4 py-4 space-y-4">
          {sidebarOptions.type === "trigger" ? <SidebarOptions /> : <ActionSidebar />}
        </div>
      </div>
    </Fragment>
  );
}
