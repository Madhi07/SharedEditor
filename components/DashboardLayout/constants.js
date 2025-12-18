import { FaBlog, FaComments, FaMoneyBill, FaPlus, FaPuzzlePiece, FaRobot, FaUsers, FaVideo, FaImage } from "react-icons/fa";

import { FaCircleQuestion, FaGear, FaHouse } from "react-icons/fa6";
import { SiChatbot } from "react-icons/si";
import { IoAnalyticsSharp } from "react-icons/io5";
import { AgentZeeHead } from "../SVG";
import { MdDashboard, MdOutlineManageAccounts } from "react-icons/md";
import { LuWorkflow } from "react-icons/lu";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegImages } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { BsImage } from "react-icons/bs";
import { FiVideo } from "react-icons/fi";


export const sidebarNavs = [
    // {
    //     icon: FaHouse,
    //     name: "Home",
    //     id: "home",
    //     href: "/dashboard",
    //     isSubscriptionRequired: true,
    //     submenu: []
    // },
    // {
    //     icon: AgentZeeHead,
    //     name: "Agents",
    //     id: "agents",
    //     href: "/dashboard/agents",
    //     isSubscriptionRequired: true,
    //     submenu: []
    // },
    {
        icon: SiChatbot,
        name: "Chatbots",
        id: "chatbots",
        href: "/dashboard/chatbots",
        isSubscriptionRequired: true,
        submenu: [
            {
                icon: IoAnalyticsSharp,
                name: "Analytics",
                id: "analytics",
                href: "/dashboard/chatbots/analytics",
            },
            {
                icon: FaComments,
                name: "Conversations",
                id: "conversations",
                href: "/dashboard/chatbots/conversations",
            },
        ]
    },

    {
        icon: FaVideo,
        name: "Media",
        id: "media",
        href: "/dashboard/media/reels",
        isSubscriptionRequired: true,
        submenu: [
            {
                icon: IoAnalyticsSharp,
                name: "Image",
                id: "image",
                href: "/dashboard/media/image",
            },
            {
                icon: FaComments,
                name: "Video",
                id: "video",
                href: "/dashboard/media/video",
            },
            {
                icon: FaComments,
                name: "Reels",
                id: "reels",
                href: "/dashboard/media/reels",
            },
        ],
    },
    // {
    //     icon: FaPuzzlePiece,
    //     name: "Integrations",
    //     id: "integrations",
    //     href: "/dashboard/integrations",
    //     isSubscriptionRequired: true,
    //     submenu: []
    // },
    // {
    //     icon: FaMoneyBill,
    //     name: "Billing",
    //     id: "billing",
    //     href: "/dashboard/billing",
    //     isSubscriptionRequired: false,
    //     submenu: []
    // },
];

export const sidebarBottomNavs = [
    {
        icon: FaGear,
        name: "Settings",
        id: "settings",
        href: "/dashboard/settings",
        isSubscriptionRequired: false,
    },
    // {
    //     icon: FaCircleQuestion,
    //     name: "Support / Docs",
    //     id: "support",
    //     href: "/dashboard/support",
    //     isSubscriptionRequired: false,
    // },
]

export const headerTitles = [
    {
        title: "Chatbots",
        path: '/dashboard/chatbots'
    },
    {
        title: "Analytics",
        path: '/dashboard/chatbots/analytics'
    },
    {
        title: "Conversations",
        path: '/dashboard/chatbots/conversations'
    },
    // {
    //     title: "Agents",
    //     path: '/dashboard/agents'
    // },
    // {
    //     title: "Chats",
    //     path: '/dashboard/chats'
    // },
    // {
    //     title: "Integrations",
    //     path: '/dashboard/integrations'
    // },
    // {
    //     title: "Billing",
    //     path: '/dashboard/billing'
    // },
    // {
    //     title: "Settings",
    //     path: '/dashboard/settings'
    // },
    // {
    //     title: "Support / Docs",
    //     path: '/dashboard/support'
    // },

];


export const mainLeftNavs = [
    {
        name: "Agents",
        id: "agents",
        href: "/dashboard/agents/chats",
        icon: FaUsers,
        submenu: [
            {
                icon: FaComments,
                name: "Chats",
                id: "chats",
                href: "/dashboard/agents/chats",
            },
            {
                icon: MdDashboard,
                name: "Dashboard",
                id: "dashboard",
                href: "/dashboard/agents/dashboard",
            },
            {
                icon: FaPuzzlePiece,
                name: "Integrations",
                id: "integrations",
                href: "/dashboard/agents/integrations",
            },
            {
                icon: LuWorkflow,
                name: "Workflow",
                id: "workflow",
                href: "/dashboard/agents/workflow",
            },
        ]
    },
    {
        name: "Chatbots",
        id: "chatbots",
        icon: AgentZeeHead,
        href: "/dashboard/chatbots/manage",
        submenu: [
            {
                icon: MdOutlineManageAccounts,
                name: "Manage",
                id: "manage",
                href: "/dashboard/chatbots/manage",
            },
            {
                icon: IoAnalyticsSharp,
                name: "Analytics",
                id: "analytics",
                href: "/dashboard/chatbots/analytics",
            },
            {
                icon: FaComments,
                name: "Conversations",
                id: "conversations",
                href: "/dashboard/chatbots/conversations",
            },
        ]
    },
    {
        icon: FaPhotoVideo,
        name: "Media",
        id: "media",
        href: "/dashboard/media/reels",
        isSubscriptionRequired: true,
        submenu: [
            {
                icon: BsImage,
                name: "Image",
                id: "image",
                href: "/dashboard/media/image",
            },
            {
                icon: FiVideo,
                name: "Video",
                id: "video",
                href: "/dashboard/media/video",
            },
            {
                icon: MdOutlineVideoLibrary,
                name: "Reels",
                id: "reels",
                href: "/dashboard/media/reels",
            },
            {
                icon: FaRegImages,
                name: "Carousel",
                id: "carousel",
                href: "/dashboard/media/carousel",
            },
            {
                icon: TfiWrite,
                name: "Blog",
                id: "blog",
                href: "/dashboard/media/blog",
            },
        ],
    },
    {
        name: "Settings",
        id: "settings",
        href: "/dashboard/settings",
        icon: FaGear,
        submenu: []
    },
]