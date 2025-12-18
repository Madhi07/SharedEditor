// src/components/Flow/nodeTypes.js

import { TriggerNode } from './Flow/TriggerNode';
import ActionNode from './Flow/ActionNode';
import ConditionNode from './Flow/ConditionNode';
import { InitialNode } from './Flow/InitialNode';
import DynamicNode from './Flow/DynamicNode';

export const flowNodeTypes = {
  intial: InitialNode,
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  dynamic: DynamicNode,
};
