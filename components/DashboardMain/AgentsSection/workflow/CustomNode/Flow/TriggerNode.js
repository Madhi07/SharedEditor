import { useFlow } from "@/context/FlowContext";
import {  User2Icon } from "lucide-react"
import { GiArrowCursor } from "react-icons/gi";
import { Handle, Position } from 'reactflow';

import AddNodeIcon from "./AddNodeIcon";
import { useMemo } from "react";


export const TriggerNode = ({ id, data }) => {

    const { onAddNode, onDelete, edges, nodeId, toggleSidebar, nodes } = useFlow();

    const lastAppsInfo = useMemo(() => {
        return nodes.find((item) => item.id == id) ?? {}
    }, [nodeId, id, nodes])

    return (
        <div

            className="addNode flex max-w-fit relative">
            <div className="max-w-[20rem] rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex item-center gap-3 flex-nowrap h-full ">
                        <div className="flex items-center gap-1 text-gray-600 p-4 border border-gray-200 rounded-xl">
                            <User2Icon className="text-gray-500 w-[24px] h-[24px]  " />
                        </div>
                        <div className="h-[inhert] flex flex-col justify-center ">
                            <h3 className="text-base font-semibold text-gray-800">
                                User Initializing
                            </h3>
                            <p className="text-sm text-gray-500">Initializing for Automation</p>
                        </div>
                    </div>
                </div>

            </div>
            {/* <div className="addNode w-[40px] h-[40px] p-1 border rounded-l-[30px] rounded-r-[5px] bg-gray-100 flex items-center justify-center">
                <div className="w-full h-full flex justify-center border border-grayscale-200  rounded-l-[30px] rounded-r-[5px] bg-gray-500 items-center">
                    <GiArrowCursor className="w-[13px] h-[13px] text-gray-200" />
                </div>

            </div> */}
            {lastAppsInfo?.apps.handles?.length && (
                lastAppsInfo?.apps.handles.map((item, index) => (
                    <Handle key={index} type={item.type} position={item.position} className=" w-3 h-3 !bg-gray-400" />
                ))
            )}
            {/* <AddNodeIcon onClick={() => onAddNode(nodeId, "dynamic")} /> */}
            {edges.length == 0 &&
                <AddNodeIcon onClick={() => toggleSidebar(nodeId, "action")} />
            }
        </div>
    )
}