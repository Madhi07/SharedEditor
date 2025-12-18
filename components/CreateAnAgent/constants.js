import { FaClipboardList, FaClone, FaPlus, FaPuzzlePiece } from "react-icons/fa";

export const agentOptions = [
    {
        id: "card-scratch",
        type: "scratch",
        title: "Start from scratch",
        description: "Build your agent with complete customization options",
        icon: FaPlus,
    },
    {
        id: "card-form",
        type: "form",
        title: "Start with form",
        description: "Use our guided form to create your perfect agent",
        icon: FaClipboardList,
    },
    {
        id: "card-template",
        type: "template",
        title: "Use template",
        description: "Start with pre-built agents for common use cases",
        icon: FaPuzzlePiece,
    },
    {
        id: "card-clone",
        type: "clone",
        title: "Clone yourself",
        description: "Create an AI agent that mimics your personality",
        icon: FaClone,
    },
];