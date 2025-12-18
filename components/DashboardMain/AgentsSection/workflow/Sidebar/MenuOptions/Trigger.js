import { menuOptions } from "../../constant/data";
import { useFlow } from "@/context/FlowContext";
import {
    Calendar,
    MessageSquare,
    MousePointer,
    Workflow,
    Code,
    SplitHorizontal,
    GitBranch
} from "lucide-react";
import { LuActivity } from "react-icons/lu";
import { LuSquareSplitHorizontal } from "react-icons/lu";

const icons = {
    cursor: <MousePointer className="w-5 h-5 text-primary" />,
    calendar: <Calendar className="w-5 h-5 text-primary" />,
    chat: <MessageSquare className="w-5 h-5 text-primary" />,
    workflow: <Workflow className="w-5 h-5 text-primary" />,
    "app-event": <LuActivity className="w-5 h-5 text-primary" />,
    if: <Code className="w-5 h-5 text-primary" />,
    "no-op": <GitBranch className="w-5 h-5 text-primary" />,
    "splitIn-batches": <LuSquareSplitHorizontal className="w-5 h-5 text-primary" />,
    switch: <GitBranch className="w-5 h-5 text-primary" />,
};

export default function SidebarOptions() {
    const { onAddNode, nodeId } = useFlow();

    return (
        <div className="p-4 space-y-3">
            {menuOptions.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onAddNode(nodeId, item.type, item)}
                    className="flex items-start space-x-3 p-3 rounded-lg cursor-pointer
                     hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 
                     transition-all duration-200"
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {icons[item.icon] || (
                            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                🔘
                            </div>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
