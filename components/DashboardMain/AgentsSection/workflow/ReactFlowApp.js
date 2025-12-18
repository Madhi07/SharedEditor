import React, { useRef, useState } from 'react';
import ReactFlow, { Background, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlow } from '@/context/FlowContext';
import { flowNodeTypes } from './CustomNode/nodeTypes';
import Sidebar from './Sidebar';
import { Plus, Minus, Maximize2, Maximize } from "lucide-react"; // icons
// ✅ This component is INSIDE ReactFlow, so useReactFlow works
const CanvasControls = ({ onFullscreen }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute z-[1000] top-[10%] right-6 flex flex-col space-y-2">
      <button
        onClick={zoomIn}
        className="w-10 h-10   bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center transition-colors"
      >
        <Plus size={16} className='text-gray-600' />
      </button>
      <button
        onClick={zoomOut}
        className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center transition-colors"
      >
        <Minus size={16} className='text-gray-600' />
      </button>
      <button
        onClick={fitView}
        className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center transition-colors"
      >
        <Maximize2 size={16} className='text-gray-600' />
      </button>
      <button
        onClick={onFullscreen}
        className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center transition-colors"
      >
        <Maximize size={16} className='text-gray-600' />
      </button>
    </div>
  );
};
const ReactFlowApp = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, sidebarOptions } = useFlow();
  const [selectedNode, setSelectedNode] = useState(null);
  const flowWrapperRef = useRef(null);

  // console.log("useReactFlow",useReactFlow())
  const handleNodeClick = (_, node) => {
    setSelectedNode(node); // store clicked node
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      flowWrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div>
      {/* <div className='h-[100px] w-full'></div> */}
      <div className="w-full h-screen overflow-auto bg-gray-50 relative flex">
        {/* React Flow Canvas */}
        <div className="flex-1" ref={flowWrapperRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={flowNodeTypes}
            fitView
            className="bg-gray-50"
          >
            {/* <Controls position="top-right" /> */}
            <Background color="#e5e7eb" gap={10} size={2} />
            <CanvasControls onFullscreen={handleFullscreen} />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default ReactFlowApp;
