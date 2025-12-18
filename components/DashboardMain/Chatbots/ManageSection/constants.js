import { FaMars, FaPhotoVideo, FaServicestack, FaShoppingCart, FaUsers, FaVenus } from "react-icons/fa";
import SetupAgent from "./SetupAgent";
import TrainAgent from "./TrainAgent";
import ConfigureSection from "./ConfigureSection";
import DeploySection from "./DeploySection";

export const fontFamilies = [
    "Inter, sans-serif"
]

export const chatbotStepperSchema = [
    {
        name: "Setup",
        id: "setup",
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
        completed: false
    },
    {
        name: "Train",
        id: 'train',
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
        completed: false
    },
    {
        name: "Configure",
        id: 'configure',
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
        completed: true
    },
    {
        name: "Deploy",
        id: 'deploy',
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
        completed: true
    }
]

export const mapStepComponent = {
    setup: {
        heading: "Build Your Agent",
        component: SetupAgent,
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    train: {
        heading: "Train Your Agent",
        component: TrainAgent,
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    configure: {
        heading: "Configure Your Agent",
        component: ConfigureSection,
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    deploy: {
        heading: "Deploy Your Agent",
        component: DeploySection,
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
};

export const chatbotConfigurationData = [
    {
        step: "setup",
        data: {
            description: "",
            description_template: null,
            gender: null,
            website_url: "",
        },
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    {
        step: "train",
        data: {
            sitemap_url: ""
        },
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    {
        step: "configure",
        data: {
            website: {
                font_family: null,
                box_shadow: null,
                border_radius: null,
                background_color: null,
                agent_bg_color: null,
                agent_name: null,
                agent_title: null,
                agent_name_text_color: null,
                agent_name_title_color: null,
                agent_panel_color: null,
                display_mode: null,
                show_agent_panel: true,
                welcome_text: null,
                input_placeholder: null,
                input_text_color: null,
                input_background_color: null,
                chat_panel_color: null,
                bot_text_bg_color: null,
                user_text_bg_color: null,
                bot_text_color: null,
                user_text_color: null,
                icon_bg_gradient_start: null,
                icon_bg_gradient_end: null,
                send_button_icon: true,
                mic_button_icon: true,
                enable_voice_input: true,
                enable_3d_avatar_mode: true,
                enable_dual_mode: true,
                enable_simple_chat_mode: true,
                enable_chatbot_actions: false,
                default_mode: "dual_mode",
                avatar: null,
            },
            "3d": {
                avatar: null
            },
            whatsapp: {},
            instagram: {
                metadata: null,
                page_id: null,
                events: []
            },
            facebook: {
                metadata: null,
                page_id: null,
                events: []
            },
            telegram: {},
            discord: {},
            slack: {}
        },
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
    {
        step: "deploy",
        data: {},
        plans: ["agentzee_starter", "agentzee_growth", "agentzee_professional", "agentzee_enterprise"],
    },
]

export const descriptionTemplatesIcons = {
    "SaaS (Software as a Service)": {
        icon: <FaServicestack />
    },
    "Community": {
        icon: <FaUsers />
    },
    "Media": {
        icon: <FaPhotoVideo />
    },
    "E-commerce": {
        icon: <FaShoppingCart />
    }

};

export const agentGenderOptions = [
    {
        name: "Male",
        icon: FaMars,
        id: "male"
    },
    {
        name: "Female",
        icon: FaVenus,
        id: "female"
    },
    // {
    //     name: "Neutral",
    //     icon: FaGenderless,
    //     id: "neutral"
    // },
];

export const requiredAgentConfigurationFields = {
    setup: [
        "description",
        "description_template",
        "gender",
        "website_url"
    ],
    train: ["sitemap_url"],
    configure: {
        website: [],
        "3d": [],
        whatsapp: [],
        instagram: [],
        telegram: [],
        discord: [],
        slack: []
    },
    deploy: []
};