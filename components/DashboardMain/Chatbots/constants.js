import { AgentZeeHead } from "@/components/SVG";
import { FaDiscord, FaFacebook, FaGlobe, FaInstagram, FaSlack, FaTelegram, FaWhatsapp } from "react-icons/fa";

export const deployPlatformOptions = [
    {
        name: "Website",
        icon: FaGlobe,
        id: "website",
        description: "Chat on site"
    },
    {
        name: "3D",
        icon: AgentZeeHead,
        id: "3d",
        description: "3D avatar chat"
    },
    {
        name: "WhatsApp",
        icon: FaWhatsapp,
        id: "whatsapp",
        description: "Business messaging"
    },
    {
        name: "Instagram",
        icon: FaInstagram,
        id: "instagram",
        description: "DM automation"
    },
    {
        name: "Facebook",
        icon: FaFacebook,
        id: "facebook",
        description: "Power up with Facebook"
    },
    {
        name: "Telegram",
        icon: FaTelegram,
        id: "telegram",
        description: "Fast messaging"
    },
    {
        name: "Discord",
        icon: FaDiscord,
        id: "discord",
        description: "Community chat"
    },
    {
        name: "Slack",
        icon: FaSlack,
        id: "slack",
        description: "Team workspace"
    },
];

