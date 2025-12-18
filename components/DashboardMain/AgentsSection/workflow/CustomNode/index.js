import { Handle, Position } from 'reactflow';
import { Plus } from 'lucide-react';
import { useFlow } from '@/context/FlowContext';
import { TriggerNode } from './Flow/TriggerNode';

const CustomNode = ({ data, id }) => {
  const { onAddNode, onDelete } = useFlow();

  return (
    <div className="relative rounded-lg w-fit h-fit  bg-white shadow">
      {/* Handles */}
      <TriggerNode />
      {/* <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 !bg-blue-500" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 !bg-blue-500" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 !bg-green-500" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 !bg-green-500" />

     

      <button
        onClick={() => onAddNode(id)}
        className="mt-2 w-8 h-8 bg-gray-300 border rounded flex items-center justify-center hover:bg-blue-50"
      >
        <Plus size={16} />
      </button> */}

      {/* Delete Button */}
      {/* <button onClick={() => onDelete(id)} className="ml-2 text-red-500">X</button> */}
    </div>
  );
};

export default CustomNode;
