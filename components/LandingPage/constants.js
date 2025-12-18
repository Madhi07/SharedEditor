import { FaAirbnb, FaAmazon, FaBolt, FaBrain, FaChartLine, FaCheck, FaComments, FaCube, FaMicrosoft, FaShieldAlt, FaSlack, FaSpotify, FaUber } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export const trustedCompanies = [
    {
        icon: "https://static.wixstatic.com/media/0a4b4a_f2b8d8193e6f4a73adc9acb5c05b14e7~mv2.png/v1/crop/x_0,y_2722,w_8534,h_3518/fill/w_193,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Mindei-68.png",
        name: "Mindei",
    },
    {
        icon: "/landing-page/team30-logo.png",
        name: "Team-30",
    },
    {
        icon: "/landing-page/episyche-logo.png",
        name: "Episyche",
    },
    {
        icon: "https://laysci.com/_next/image?url=%2Fheader-imgs%2FLaySci.png&w=256&q=75",
        name: "LaySci",
    },
    {
        icon: "https://www.thworks.org/logo.png",
        name: "THWorks",
    },
]

export const features = [
    {
        id: "feature-1",
        icon: FaBrain,
        title: "Advanced AI Intelligence",
        description: "Our agents leverage multiple AI models to understand context, emotion, and intent for natural conversations.",
        link: "/features/advanced-ai-intelligence",
        shortTitle: "AI Intelligence"
    },
    {
        id: "feature-2",
        icon: FaCube,
        title: "Realistic 3D Models",
        description: "Choose from dozens of life like 3D models or create custom agents that match your brand identity.",
        link: "/features/realistic-3d-models",
        shortTitle: "3D Models"
    },
    {
        id: "feature-3",
        icon: FaBolt,
        title: "No-Code Integration",
        description: "Easily integrate agents into your website, app, or VR environment with our simple drag-and-drop interface.",
        link: "/features/no-code-integration",
        shortTitle: "Easy Integration"
    },
    {
        id: "feature-4",
        icon: FaComments,
        title: "Multi-Modal Communication",
        description: "Agents communicate through text, voice, and gestures, creating a more human-like interaction experience.",
        link: "/features/multi-modal-communication",
        shortTitle: "Communication"
    },
    {
        id: "feature-5",
        icon: FaChartLine,
        title: "Analytics Dashboard",
        description: "Gain insights into user interactions, sentiment analysis, and conversion metrics through our advanced dashboard.",
        link: "/features/analytics-dashboard",
        shortTitle: "Analytics & Insights",
        lineChartData: [
            { label: 'Mon', value: 3200 },
            { label: 'Tue', value: 3800 },
            { label: 'Wed', value: 4100 },
            { label: 'Thu', value: 3900 },
            { label: 'Fri', value: 4500 },
            { label: 'Sat', value: 3700 },
            { label: 'Sun', value: 4200 },
        ],
        doughnutChartData: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [65, 25, 10]
            }]
        }
    },
    {
        id: "feature-6",
        icon: FaShieldAlt,
        title: "Enterprise Security",
        description: "Bank-level encryption and compliance with global privacy regulations ensure your data remains secure.",
        link: "/features/enterprise-security",
        shortTitle: "Enterprise Security",
    }
]

export const howItWorksSteps = [
    {
        id: "step-1",
        title: "Design Your Agent",
        description: "Create a custom multi-channel chatbot for WhatsApp, Instagram, Telegram, Slack, and more. Fully personalize its appearance, voice, and personality to match your brand.",
    },
    {
        id: "step-2",
        title: "Train & Configure",
        description: "Upload your knowledge base, set response parameters, and train your agent on your products, services, and company information.",
    },
    {
        id: "step-3",
        title: "Deploy & Optimize",
        description: "Integrate your agent into your digital platforms with a single line of code. Monitor performance and optimize based on analytics.",
    }
]

export const pricingPlans = [
    {
        name: "Starter",
        description: "Perfect for small businesses",
        priceINR: "₹2100",
        priceUSD: "$25",
        features: [
            {
                icon: FaCheck,
                text: "Custom Text Agent",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "5,000 credits/month",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Basic analytics",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Max Page Support: 50",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Email Support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaXmark,
                text: "Voice & Video Call",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "Multilingual Support",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "Page actions",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "Speech Recognition",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "Advanced Customization",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "3D Avatar (500mins)",
                liClassName: "text-gray-500",
            },
        ],
        buttonText: "Start 6-Month Trial",
        is_credit_card_required: false,
        lookup_key: "agentzee_starter_lookup",
        razorpay_plan_id: process.env.RAZORPAY_STARTER_PLANID,
        plan: "agentzee_starter",
    },
    {
        name: "Growth",
        description: "Perfect for medium businesses",
        priceINR: "₹4200",
        priceUSD: "$50",
        features: [
            {
                icon: FaCheck,
                text: "Custom Text Agent",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "10,000 credits/month",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Basic analytics",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Max Page Support: 100",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Email Support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Voice Call",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Multilingual Support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Page actions",
                iconClassName: "text-green-500",
            },
            {
                icon: FaXmark,
                text: "Speech Recognition",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "Advanced Customization",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "3D Avatar (500mins)",
                liClassName: "text-gray-500",
            },
        ],
        buttonText: "Start 7-Day Trial",
        is_credit_card_required: true,
        lookup_key: "agentzee_growth_lookup",
        razorpay_plan_id: process.env.RAZORPAY_GROWTH_PLANID,
        plan: "agentzee_growth",
    },
    {
        name: "Professional",
        description: "For growing businesses",
        popular: true,
        priceINR: "₹8400",
        priceUSD: "$100",
        features: [
            {
                icon: FaCheck,
                text: "Custom Text, Voice Agent",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "50,000 credits/month",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Advanced analytics",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Max Page Support: 200",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Priority support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Voice & Video Call",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Multilingual Support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Page actions",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Speech Recognition",
                iconClassName: "text-green-500",
            },
            {
                icon: FaXmark,
                text: "Advanced Customization",
                liClassName: "text-gray-500",
            },
            {
                icon: FaXmark,
                text: "3D Avatar (500mins)",
                liClassName: "text-gray-500",
            },
        ],
        buttonText: "Start 7-Day Trial",
        lookup_key: "agentzee_professional_lookup",
        razorpay_plan_id: process.env.RAZORPAY_PRO_PLANID,
        is_credit_card_required: true,
        plan: "agentzee_professional",
    },
    {
        description: "For large enterprises",
        name: "Enterprise",
        priceINR: "₹42000",
        priceUSD: "$490",
        features: [
            {
                icon: FaCheck,
                text: "Custom Text, Voice, Avatar Agent",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Unlimited credits",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Enterprise analytics",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Unlimited",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "24/7 dedicated support",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Voice & Video Call",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "Multilingual Support",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Page actions",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Speech Recognition",
                iconClassName: "text-green-500",
            },
            {
                icon: FaCheck,
                text: "Advanced Customization",
                iconClassName: "text-green-400",
            },
            {
                icon: FaCheck,
                text: "3D Avatar (500mins)",
                iconClassName: "text-green-400",
            },

        ],
        buttonText: "Contact Sales",
        is_credit_card_required: true,
        lookup_key: "",
        razorpay_plan_id: process.env.RAZORPAY_ENTERPRISE_PLANID,
        plan: "agentzee_enterprise",
    }
];

export const wallOfLove = [
    "https://youtube.com/embed/HSHzthpm9n8",
    "https://youtube.com/embed/sO40Gx68TkM",
    "https://youtube.com/embed/gM0RsNbOlZg",
    "https://youtube.com/embed/zq7DKgLSliM",
    "https://youtube.com/embed/9Mq1nEgcuq4",
    "https://youtube.com/embed/NvIBmozSQv4",

]

export const testimonials = [
    {
        id: "testimonial-1",
        customerName: "Alex Thompson",
        position: "CEO, TechNova",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        testimonial: "AgentZee transformed our customer service operations. Our 3D AI agents handle 80% of inquiries automatically, and customers love the interactive experience.",
        rating: 5
    },
    {
        id: "testimonial-2",
        customerName: "Samantha Lee",
        position: "Marketing Director, Fusion",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        testimonial: "The level of customization with AgentZee is incredible. We created agents that perfectly match our brand personality, and our conversion rates have increased by 45%.",
        rating: 5
    },
    {
        id: "testimonial-3",
        customerName: "Michael Chen",
        position: "CTO, Quantum Solutions",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        testimonial: "As a technical leader, I was impressed by how easy it was to integrate AgentZee into our existing systems. The API is robust and the documentation is excellent.",
        rating: 4.5
    }
];

export const faqs = [
    {
        id: "faq-1",
        question: "What is a 3D AI Agent?",
        answer: "A 3D AI Agent is an intelligent virtual assistant with a three-dimensional visual representation that can interact with users through natural language, gestures, and expressions. Our agents combine advanced AI models for understanding and generating human-like responses with realistic 3D models for a more engaging user experience."
    },
    {
        id: "faq-2",
        question: "Do I need technical skills to use AgentZee?",
        answer: "No technical skills are required. Our platform features an intuitive drag-and-drop interface that allows anyone to create, customize, and deploy 3D AI agents. For advanced users, we also offer API access and developer tools for deeper integration and customization."
    },
    {
        id: "faq-3",
        question: "How secure is my data with AgentZee?",
        answer: "We take data security very seriously. All data is encrypted both in transit and at rest using bank-level encryption. We are compliant with GDPR, CCPA, and other global privacy regulations. Your data is never used to train our models without explicit permission, and you retain full ownership of all your data."
    },
    {
        id: "faq-4",
        question: "Can I integrate AgentZee with my existing systems?",
        answer: "Yes, AgentZee is designed to integrate seamlessly with your existing systems. We offer integrations with popular CRM platforms, e-commerce solutions, and customer service tools. Our RESTful API allows for custom integrations with virtually any system. Our documentation and support team can guide you through the integration process."
    },
    {
        id: "faq-5",
        question: "What languages do the AI agents support?",
        answer: "Our AI agents currently support over 30 languages, including English, Spanish, French, German, Chinese, Japanese, Arabic, and more. The agents can detect the user's language automatically and respond accordingly. Custom language training is available for Enterprise customers."
    }
];