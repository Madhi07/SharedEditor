import { useFlow } from "@/context/FlowContext";
import { PlusIcon } from "lucide-react"

import { v4 as uuidV4 } from 'uuid';


export const InitialNode = ({ data }) => {

    const { onAddNode, onDelete, nodeId, toggleSidebar } = useFlow();

    return (
        <div
            onClick={() => toggleSidebar('trigger')}
            className="addNode w-20 h-20">
            <div className="w-20 h-20 border-2 rounded-lg border-dashed border-gray-400 cursor-pointer flex justify-center items-center">
                <PlusIcon className="text-2xl text-gray-700" />
            </div>
            <p className="text-[10px]">Add first step.. </p>
        </div>
    )
}