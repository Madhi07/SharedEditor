// context/FlowContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addEdge } from 'reactflow'
import { v4 as uuidV4 } from 'uuid';

import ReactFlow, {

    useNodesState,
    useEdgesState,

} from 'reactflow';
import { useRouter } from 'next/router';

let API_URL = 'https://agentzee-workflow-api.episyche.com'
const FlowContext = createContext();

const getEdgeStyle = (edgeType) => {
    switch (edgeType) {
        case "start":
            return { stroke: "#3B82F6", strokeWidth: 2 }; // blue
        case "success":
            return { stroke: "#10B981", strokeWidth: 2 };
        case "trigger":
            return { stroke: "#F59E0B", strokeWidth: 2, strokeDasharray: "6 3" }; // dashed
        case "validation":
            return { stroke: "#8B5CF6", strokeWidth: 2 };
        case "error":
            return { stroke: "#EF4444", strokeWidth: 3 }; // thicker for emphasis
        case "final":
            return { stroke: "#06B6D4", strokeWidth: 2, strokeDasharray: "2 4" }; // dotted
        default:
            return { stroke: "#9CA3AF", strokeWidth: 1 }; // fallback gray
    }
};
export const useFlow = () => useContext(FlowContext);

export const FlowProvider = ({ children }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [lastNodeInfo, setLastNodeInfo] = useState({});
    const [nodeId, setNodeId] = useState('1');
    const router = useRouter()


    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');

    const thirdPath = router?.query?.index?.[2] ?? null

    const [sidebarOptions, setsidebarOptions] = useState({
        show: false,
        type: null,
    })


    const onAddNode = useCallback(async (sourceId, type = 'action', apps = {}) => {
        const sourceNode = nodes.find((n) => n.id === sourceId);
        if (sourceNode) {
            let newNodeId = uuidV4()
            if (sourceNode.type === 'intial') {
                const newNode = {
                    id: `${newNodeId}`,
                    apps: apps,
                    step: 1,
                    type: type,
                    position: { x: sourceNode.position.x, y: sourceNode.position.y },
                    data: { description: `Step ${newNodeId}`, onAddNode, onDelete },
                };
                setNodes([newNode]);
                setNodeId(newNodeId)
                setEdges([]);
            } else {
                const newNode = {
                    id: `${newNodeId}`,
                    apps: apps,
                    step: nodes.length + 1,
                    type: type,
                    position: { x: sourceNode.position.x + 500, y: sourceNode.position.y },
                    data: { description: `Step ${newNodeId}`, onAddNode, onDelete },
                };

                setLastNodeInfo(newNode)
                setNodes([...nodes, newNode]);
                let newEdges = {
                    id: `e${newNodeId}-${nodeId}`,
                    nodeId: nodeId,
                    source: nodeId,
                    name: sourceId,
                    lastNodeTypes: "type",
                    target: `${newNodeId}`,
                    sourceHandle: 'right',
                    style: getEdgeStyle(sourceNode.type),
                    targetHandle: 'left',
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: {
                        type: 'arrowclosed',       // arrowhead
                        color: getEdgeStyle(sourceNode.type).stroke,
                    },
                }

                setEdges((eds) => [
                    ...eds,
                    newEdges,
                ]);

                setNodeId(newNodeId)

                if (thirdPath) {
                    updateWorkFlowJsonData(
                        [...nodes, newNode],
                        [...edges, newEdges,]
                    )

                }

            }
            setsidebarOptions((e) => ({ ...e, show: false }))
        } else {
            let newNodeId = uuidV4()
            const newNode = {
                id: `${newNodeId}`,
                apps: apps,
                step: 1,
                type: 'trigger',
                position: { x: 113, y: 200 },
                data: { description: `Step ${newNodeId}`, onAddNode, onDelete },
            };
            setNodes([newNode]);
            setNodeId(newNodeId)
            setsidebarOptions((e) => ({ ...e, show: false }))
            setEdges([]);
        }

    }, [nodeId, nodes, thirdPath]);

    const updateWorkFlowJsonData = async (updatedNodes, updatedEdges) => {
        await fetch(`${API_URL}/workflows/update/${thirdPath}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workflow_json: {
                    workflow_id: thirdPath,
                    nodes: updatedNodes,
                    edges: updatedEdges
                }
            })
        })
            .then((data) => {
            })
    }

    // Delete Node
    const onDelete = useCallback((idToDelete) => {
        setNodes((nds) => nds.filter((n) => n.id !== idToDelete));
        setEdges((eds) => eds.filter((e) => e.source !== idToDelete && e.target !== idToDelete));
        if (thirdPath) {
            updateWorkFlowJsonData([nodes.filter((n) => n.id !== idToDelete), edges.filter((e) => e.source !== idToDelete && e.target !== idToDelete)])
        }
    }, [thirdPath]);

    // Connect Nodes
    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds));
    }, []);

    function getLastNodeIds(workflow) {
        const edges = workflow.workflow_json.edges || [];

        // Collect all source and target node IDs
        const sources = new Set(edges.map(e => e.source));
        const targets = new Set(edges.map(e => e.target));

        // Last nodes = targets that are not sources
        const lastNodes = [...targets].filter(t => !sources.has(t));

        return lastNodes;
    }
    const getAllNodes = async () => {
        await fetch(`${API_URL}/workflows/${thirdPath}`, { method: "GET", })
            .then((data) => data.json())
            .then((data) => {
                if (data.workflow_json) {
                    if (data?.workflow_json?.nodes?.length) {
                        setNodes(data?.workflow_json?.nodes)
                    }

                    if (data?.workflow_json?.edges?.length) {
                        setEdges(data?.workflow_json?.edges)
                    }

                    if (getLastNodeIds(data).length) {
                        setNodeId(getLastNodeIds(data)?.[0])
                    }

                }
            })
    }


    useEffect(() => {
        if (thirdPath) {
            getAllNodes()

        } else {
            setNodes([
                {
                    id: "1", type: 'intial', name: "intial", className: "",
                    position: { x: 250, y: 250 },
                    data: {
                        // label: 'Start',
                        // description: 'Trigger point',
                        onAddNode, onDelete,
                    },
                },
            ]);
            setEdges([]);
            setNodeId('1')
        }
    }, [thirdPath])


    const toggleSidebar = useCallback((options) => {

        if (options === 'trigger') {
            setsidebarOptions((e) => ({ ...e, show: true, type: options }))
        } else {
            setsidebarOptions((e) => ({ ...e, show: true, type: options }))
        }

    }, [])

    const closeSideBar = useCallback(() => {
        setsidebarOptions((e) => ({ ...e, show: false }))
    }, [])


    // Load JSON
    const loadFromJSON = (jsonData) => {
        if (jsonData?.nodes && jsonData?.edges) {
            setNodes(jsonData.nodes);
            setEdges(jsonData.edges);
            setNodeId(Math.max(...jsonData.nodes.map(n => parseInt(n.id))) + 1);
        }
    };

    // Export JSON
    const exportToJSON = () => ({ nodes, edges });


    const [logs, setLogs] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const runWorkflow = () => {
        setLogs([]);
        setIsRunning(true);

        const workflowId = "c8d2e3ef-4fc2-4af6-a6cb-638da13ad046";
        const url = `https://agentzee-workflow-api.episyche.com/workflow/execute/${workflowId}`;

        const es = new EventSource(url);

        es.onmessage = (event) => {
            if (event.data?.startsWith("ping")) return; // ignore ping messages

            try {
                const data = JSON.parse(event.data);
                const timestamp = new Date().toLocaleTimeString();
                setLogs((prev) => [...prev, { ...data, timestamp }]);

                // ====== 🔵 Node updating logic based on node_type and result ======
                const { node_type, node, result } = data;

                if (node_type === "trigger-manually") {
                    setNodes((prev) =>
                        prev.map((n) =>
                            n.apps?.id === "trigger-manually"
                                ? { ...n, data: { ...n.data, status: result?.status || "success" } }
                                : n
                        )
                    );
                }

                if (node_type === "gemini-api") {
                    setNodes((prev) =>
                        prev.map((n) =>
                            n.apps?.id === "gemini-api"
                                ? {
                                    ...n,
                                    data: {
                                        ...n.data,
                                        status: result?.status || "done",
                                        files: result?.files || [],
                                    },
                                }
                                : n
                        )
                    );
                    setEdges((prev) =>
                        prev.map((e) =>
                            e.target.includes("gemini")
                                ? { ...e, style: getEdgeStyle(result?.status === "done" ? "success" : "pending") }
                                : e
                        )
                    );
                }

                if (node_type === "instagram-api") {
                    setNodes((prev) =>
                        prev.map((n) =>
                            n.apps?.id === "instagram-api"
                                ? {
                                    ...n,
                                    data: {
                                        ...n.data,
                                        status: result?.status || "posted",
                                        post_id: result?.post_id,
                                        image_url: result?.image_url,
                                        caption: result?.caption,
                                    },
                                }
                                : n
                        )
                    );
                    setEdges((prev) =>
                        prev.map((e) =>
                            e.target.includes("instagram")
                                ? { ...e, style: getEdgeStyle(result?.status === "posted" ? "success" : "pending") }
                                : e
                        )
                    );
                }

                // ====== 🟢 Workflow completion ======
                if (data.status === "workflow_completed") {
                    es.close();
                    setIsRunning(false);
                    setEdges((prev) =>
                        prev.map((e) => ({ ...e, style: getEdgeStyle("final") }))
                    );
                }
            } catch (err) {
                console.error("Error parsing SSE data:", err);
            }
        };

        es.onerror = (err) => {
            console.error("SSE connection error:", err);
            es.close();
            setIsRunning(false);
        };
    };

    // Update Gemini node prompt
    const updateGeminiPrompt = useCallback(() => {

        let copyNodes = structuredClone(nodes)


       let updatemap = copyNodes.map((node) => {
            if (node.apps.provider_id === "gemini" || node.apps.provider_id ==="gemini-api") {
                return {
                    ...node,
                    apps: {
                        ...node.apps,
                        config: {
                            ...node.apps.config,
                            prompt: prompt,
                        },
                    },
                };
            }
            return node;
        })
        setNodes(updatemap);
        updateWorkFlowJsonData(updatemap, edges)

        //  setNodes((prevNodes) =>
        //     prevNodes.map((node) => {
        //         if (node.apps.provider_id === "gemini") {
        //             return {
        //                 ...node,
        //                 apps: {
        //                     ...node.apps,
        //                     config: {
        //                         ...node.apps.config,
        //                         prompt: prompt,
        //                     },
        //                 },
        //             };
        //         }
        //         return node;
        //     })
        // );
        setIsOpen(false);
    },[prompt]);


    return (
        <FlowContext.Provider
            value={{
                nodeId,
                nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, onAddNode,
                onDelete, onConnect, setNodes,
                setEdges, loadFromJSON, exportToJSON,
                sidebarOptions, setsidebarOptions,
                toggleSidebar, closeSideBar, lastNodeInfo,
                runWorkflow,
                logs, setLogs,
                isRunning,

                isOpen, setIsOpen,
                prompt, setPrompt,
                updateGeminiPrompt
            }}
        >

            {children}
            {isOpen && (
                <div className="fixed inset-0 z-[100000] w-screen h-screen flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4 text-black">Update Gemini Prompt</h2>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full border border-gray-300 text-black focus:text-black  rounded-md p-2 mb-4"
                            rows={4}
                            placeholder="Enter your prompt..."
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateGeminiPrompt}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FlowContext.Provider>
    );
};
