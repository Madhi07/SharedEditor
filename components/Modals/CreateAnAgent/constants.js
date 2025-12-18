import { FaCommentDots, FaPhone, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const examples = [
    "Customer support",
    "Feedback collection",
    "Product recommendations",
    "Educational assistant",
    "Lead generation",
];

export const channelTypes = [
    {
        id: 'chatbot',
        name: 'Chatbot',
        icon: FaCommentDots,
    },
    {
        id: 'phone',
        name: 'Phone',
        icon: FaPhone,
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: FaWhatsapp,
    },
    {
        id: 'email',
        name: 'Email',
        icon: MdEmail,
    },
]