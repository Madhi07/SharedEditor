import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";

export const ACTION_LIST = [
    {
        id: "video",
        label: "Video",
        icon: <FaPlay size={15} className="flex-shrink-0" />,
        show: (item) => !!item.video_url,   
        onClick: (item, { openVideo }) => openVideo(item),
    },
    {
        id: "edit",
        label: "Edit",
        icon: <FaEdit className="flex-shrink-0" />,
        show: () => true,
        onClick: (item, { editItem }) => editItem(item),
    },
    {
        id: "delete",
        label: "Delete",
        icon: <FaTrash className="flex-shrink-0" />,
        show: () => true,
        onClick: (item, { deleteItem }) => deleteItem(item),
    },
];


