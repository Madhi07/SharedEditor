import React, { useState, Fragment } from 'react';
import { Home, GitBranch, Play, BarChart3, HelpCircle, Bell, Github, Plus, Minus, Maximize2, Zap, Table } from 'lucide-react';
import ReactFlowApp from './ReactFlowApp';
import Link from 'next/link';
import { useFlow } from '@/context/FlowContext';

export default function WorkflowEditor() {
   
    const { logs,isRunning,runWorkflow,setLogs } = useFlow()
  
    const [isActive, setIsActive] = useState(false);
    const [workflowName, setWorkflowName] = useState('My workflow 2');
    const [isEditingName, setIsEditingName] = useState(false);
    const [activeTab, setActiveTab] = useState('Editor');



   

    return (
        <Fragment>
            {/* Left Sidebar */}
          

            {/* Main Content */}
            <div className=" h-[100%] overflow-auto flex flex-col bg-gray-50">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link href={'/dashboard/agents/workflow'} className="text-gray-600">Personal</Link>
                        <span className="text-gray-300">/</span>
                        {isEditingName ? (
                            <input
                                type="text"
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                                className="bg-gray-100 text-black px-2 py-1 rounded border border-gray-300"
                                autoFocus
                            />
                        ) : (
                            <span className="text-black font-medium cursor-pointer hover:text-gray-700" onClick={() => setIsEditingName(true)}>{workflowName}</span>
                        )}
                        <span className="text-gray-300">/</span>
                        <button className="text-gray-500 hover:text-black transition-colors">+ Add tag</button>
                    </div>

                    <div className="flex space-x-6">
                        {['Editor', 'Executions', 'Evaluations'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'} pb-1 transition-colors`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-600 text-sm">{isActive ? 'Active' : 'Inactive'}</span>
                            <div
                                onClick={() => setIsActive(!isActive)}
                                className={`w-10 h-5 ${isActive ? 'bg-black' : 'bg-gray-300'} rounded-full relative cursor-pointer transition-colors`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${isActive ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-200 text-black text-sm rounded hover:bg-gray-300 transition-colors">
                            Share
                        </button>
                        <button className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
                            Save
                        </button>
                        <div className="flex items-center space-x-1 text-sm">
                            <Github className="text-gray-500" size={16} />
                            <span className="text-gray-700">143,111</span>
                        </div>
                    </div>
                </div>

                {/* Workflow Canvas */}
                <div className="flex-1 relative overflow-hidden bg-white">
                    <ReactFlowApp />

                </div>

                {/* Bottom Panel */}
                <div className="bg-white border-t border-gray-200 h-48 relative">
                    <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
                        <div className="flex space-x-6">
                            <button className="text-black border-b-2 border-black pb-1">Logs</button>
                        </div>
                        <button onClick={() => setLogs([])} className="text-gray-500 hover:text-black text-sm transition-colors">
                            Clear execution
                        </button>
                    </div>

                    <div className="p-6 space-y-3 overflow-y-auto h-32">
                        {console.log("logs",logs)}
                        {logs.length === 0 ? (
                            <div className="text-gray-400 text-sm">No executions yet. Click "Execute workflow" to run.</div>
                        ) : (
                            logs.map((node, idx) => (
                                <div key={idx} className="flex items-start space-x-4">
                                    <div className="w-2 h-2 bg-black rounded-full mt-1" />
                                    <div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-black text-sm font-medium">{node.message}</span>
                                            <span className="text-gray-700 text-sm capitalize">{node.status}</span>
                                            <span className="text-gray-500 text-sm">in {node.timestamp}</span>
                                        </div>
                                        {node.output && (
                                            <div className="text-gray-500 text-sm mt-1">Output: {node.output}</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <button onClick={runWorkflow} className="px-8 py-3 gap-2 from-primary to-secondary bg-gradient-to-r hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-full transition-colors flex items-center cursor-pointer">
                            <Play className="text-white" size={16} />
                            <span>Execute workflow</span>
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}