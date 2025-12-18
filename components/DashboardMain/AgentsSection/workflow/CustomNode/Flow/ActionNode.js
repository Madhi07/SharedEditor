import React from 'react';
import { Handle, Position } from 'reactflow';
import { Plus, X } from 'lucide-react';
import { useFlow } from '@/context/FlowContext';

const ActionNode = ({ id, data }) => {
    const { onAddNode, onDelete } = useFlow();

    return (
        <div className="relative p-4 bg-green-50 rounded-lg shadow w-40">
            <div className="font-bold text-green-700 mb-2">Action Node</div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-green-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-500" />

            {/* Buttons */}
            <div className="flex justify-between mt-2">
                <button
                    onClick={() => onAddNode(id, 'action')}
                    className="w-8 h-8 bg-green-200 rounded flex items-center justify-center hover:bg-green-300"
                >
                    <Plus size={16} />
                </button>

                <button onClick={() => onDelete(id)} className="text-red-500 font-bold">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default ActionNode;
