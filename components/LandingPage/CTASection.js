import { useAuthContext } from "@/context/useAuthContext";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

export default function CTASection() {
    const { loginUser } = useAuthContext();
    return (
        <div id="cta" className="relative">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl p-8 md:p-16 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://storage.googleapis.com/uxpilot-auth.appspot.com/default-placeholder.png')] bg-cover bg-center opacity-10"></div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Customer Experience?</h2>
                        <p className="text-xl text-gray-300 mb-8">Join hundreds of forward-thinking businesses using AgentZee.ai to create engaging, intelligent interactions.</p>

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                href={loginUser?.token ? '/dashboard/agents/chats' : '/sign-up'}
                                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                href={"https://calendar.app.google/QSrGLwnkApJ6uxHu7"}
                                target="_blank"
                                rel="noopener"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                            >
                                <FaCalendarAlt className="mr-2" /> Schedule Demo
                            </Link>
                        </div>

                        <p className="mt-6 text-gray-400">No credit card required. 14-day free trial.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
