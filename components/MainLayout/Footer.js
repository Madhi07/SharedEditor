import Link from "next/link";
import { footerNavLinks, socialLinks } from "./constants";
import Image from "next/image";

export default function Footer() {
    return (
        <footer id="footer" className="py-16 relative bg-dark-bg-secondary">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-2">
                        <Link
                            href={"/"}
                            className="flex items-center cursor-pointer mb-6"
                        >
                            <Image
                                src={'/agentzee-logo.png'}
                                alt="AgentZee AI"
                                unoptimized
                                quality={100}
                                width={1920}
                                height={1080}
                                className="sm:w-40 w-36 object-contain h-auto"
                            ></Image>
                        </Link>

                        <p className="text-gray-400 mb-6">Create, customize, and deploy intelligent 3D AI agents that revolutionize how your business interacts with customers.</p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener"
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <link.icon className="text-xl" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {footerNavLinks.map((section, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-bold mb-4">{section.name}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 mb-4 md:mb-0">© 2025 AgentZee.ai. All rights reserved.</p>
                    {/* <div className="flex space-x-6">
                        <Link
                            href={"/privacy-policy"}
                            className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={"/terms-of-service"}
                            className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                        >
                            Terms of Service
                        </Link>
                    </div> */}
                </div>
            </div>
        </footer>
    )
}
