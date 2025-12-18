import { Fragment, useMemo, useState } from "react";
import { Handle, Position } from "reactflow";
import { FaCheckCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import dynamic from "next/dynamic";
import AddNodeIcon from "./AddNodeIcon";
import AutomationCard from "../Card";
import { useFlow } from "@/context/FlowContext";
import { Trash2Icon } from "lucide-react";

const Oval = dynamic(
    () => import("react-loader-spinner").then(mod => mod.Oval),
    { ssr: false }
);

export default function DynamicNode({ id, data }) {
    const { onAddNode, onDelete, nodes, nodeId, toggleSidebar } = useFlow();
    const [hover, setHover] = useState(false);

    const lastAppsInfo = useMemo(() => {
        return nodes.find((item) => item.id == id) ?? {};
    }, [nodeId, id, nodes]);

    return (
        <Fragment>
            <div
                className="relative"
                id={id}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {/* Handles */}
                <Handle type={'target'} position={Position.Left} className="w-3 h-3 !bg-gray-400" />
                <Handle type={'source'} position={Position.Right} className="w-3 h-3 !bg-gray-400" />

                {/* Automation card */}
                <AutomationCard apps={lastAppsInfo?.apps ?? {}} />

                {/* Node Status */}
                <div className="absolute bottom-1 right-1">
                    {data?.status === "running" && (
                        <Oval
                            visible={true}
                            height="30"
                            width="30"
                            color="#4fa94d"
                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            ariaLabel="oval-loading"
                        />
                    )}
                    {data?.status === "success" && <FaCheckCircle className="text-green-500 w-5 h-5" />}
                    {data?.status === "error" && <FaX className="text-red-500 w-5 h-5" />}
                </div>

                {/* Add Node Icon */}
                {id === nodeId && <AddNodeIcon onClick={() => toggleSidebar(nodeId, "action")} />}

                {/* Delete Icon - shows on hover */}
                {/* {hover && (
                    <button
                        onClick={() => onDelete(id)}
                        className="absolute  -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center z-50"
                    >
                        <Trash2Icon className="w-3 h-3 cursor-pointer" />
                    </button>
                )} */}
            </div>
        </Fragment>
    );
}
