import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export const headerNavLinks = [
    {
        href: "/#features",
        title: "Features"
    },
    {
        href: "/#how-it-works",
        title: "How It Works"
    },
    {
        href: "/pricing",
        title: "Pricing"
    },
    {
        href: "/blogs",
        title: "Blogs"
    },
    {
        href: "/#faqs",
        title: "FAQs"
    }
]

export const socialLinks = [
    {
        href: "https://x.com/Agent65348Zee",
        icon: FaXTwitter
    },
    // {
    //     href: "https://www.linkedin.com",
    //     icon: FaLinkedin
    // },
    {
        href: "https://www.instagram.com/agentzee.ai/",
        icon: FaInstagram
    },
    // {
    //     href: "https://github.com/",
    //     icon: FaGithub
    // },
    {
        href: "https://www.facebook.com/profile.php?id=61577077299103",
        icon: FaFacebook
    },
]

export const footerNavLinks = [
    {
        name: "Product",
        links: [
            { href: "/#features", title: "Features" },
            { href: "/#pricing", title: "Pricing" },
            // { href: "/", title: "Case Studies" },
            // { href: "/", title: "Documentation" },
            // { href: "/", title: "API" }
        ]
    },
    {
        name: "Company",
        links: [
            // { href: "/", title: "About Us" },
            { href: "/blogs", title: "Blogs" },
            // { href: "/", title: "Careers" },
            // { href: "/", title: "Press" },
            { href: "/contact-us", title: "Contact Us" }
        ]
    },
    {
        name: "Legal",
        links: [
            { href: "/privacy-policy", title: "Privacy Policy" },
            { href: "/terms-of-service", title: "Terms of Service" },
            // { href: "/", title: "Cookie Policy" },
            // { href: "/", title: "GDPR" }
        ]
    }
]