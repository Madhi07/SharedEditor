// components/TriggerAutomationCard.js
import { useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import Image from "next/image";
import { useFlow } from "@/context/FlowContext";

export default function AutomationCard({ apps }) {
    const { nodes, setNodes, isOpen, setIsOpen, prompt, setPrompt } = useFlow();

    return (
        <div className="max-w-sm rounded-xl bg-white p-0 border border-gray-200">
            <div className="flex items-start justify-between ">
                <div className="flex gap-2 flex-nowrap">
                    <div className="flex items-center gap-1 text-gray-600 p-4  rounded-xl cursor-pointer"
                        onClick={() => apps.provider_id === "gemini" && (setIsOpen(true), setPrompt(apps?.config?.prompt || ""))}>
                        {apps?.icon ? (
                            <Image
                                src={apps.icon}
                                alt={apps.name}
                                width={24}
                                height={24}
                                className="min-w-[24px] min-h-[24px]"
                                unoptimized
                            />
                        ) : (
                            <IoCalendarClearOutline className="text-gray-500 w-[24px] h-[24px]" />
                        )}
                        {/* <span className="ml-2">{apps.name}</span> */}
                    </div>
                </div>
            </div>

            {/* Popup Modal */}

        </div>
    );
}
