// components/TriggerAutomationCard.js
import { FaRocket } from "react-icons/fa";
import { FaBox } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { LuZap } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { HiCube } from "react-icons/hi2";
import Image from "next/image";
import { useFlow } from "@/context/FlowContext";

export default function AutomationCard({ apps }) {

    const { onAddNode, onDelete, edges, nodeId, toggleSidebar, nodes,setNodes } = useFlow();
    console.log("nodes", nodes,apps)
    return (
        <div className="max-w-sm rounded-xl bg-white p-0 ">
            <div className="flex items-start justify-between">
                <div className="flex gap-2 flex-nowrap">
                    <div className="flex items-center gap-1 text-gray-600 p-4 border border-gray-200 rounded-xl">

                        {apps?.icon ?
                            <Image
                                src={`${apps?.icon}`} // store icons here
                                // src={`/icons/${apps?.icon}.png`} // store icons here
                                alt={apps?.name}
                                width={24}
                                height={24}
                                className="min-w-[24px] min-h-[24px]"
                                unoptimized
                            /> :
                            <IoCalendarClearOutline className="text-gray-500 w-[24px] h-[24px] " />
                        }
                    </div>
                 
                </div>
        
            </div>

            {/* Stats Row */}
            {/* {apps.oauth === true &&

                <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600 border border-gray-200 p-2 rounded-md">
                        <HiCube className="text-gray-500 w-[24px] h-[24px]" />
                        <span className="text-sm font-medium">11</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600  border border-gray-200 p-2 rounded-md">
                        <FaRocket className="text-gray-500 w-[20px] h-[20px]" />
                        <span className="text-sm font-medium">27</span>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 border border-green-200 p-2 rounded-md">
                        <FaCheckCircle className="text-green-500  w-[20px] h-[20px]" />
                        <span className="text-sm font-medium">41</span>
                    </div>

                    <div className="flex items-center gap-2 text-purple-600  border border-purple-200 p-2 rounded-md">
                        <LuZap className="text-purple-500" />
                        <span className="text-sm font-medium">72</span>
                    </div>
                </div>
            } */}
        </div>
    );
}
