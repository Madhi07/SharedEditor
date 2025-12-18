import Link from "next/link";
import { howItWorksSteps } from "./constants";
import { useAuthContext } from "@/context/useAuthContext";

export default function HowItWorksSection() {
    const { loginUser } = useAuthContext();
    return (
        <div className="relative">
            <div className="absolute bottom-0 left-0 sm:w-96 sm:h-96 w-48 h-48 rounded-full bg-secondary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                        <p className="text-sm font-medium">Multi-Channel Chatbot</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">How AgentZee Chatbot Works</h2>
                    <p className="text-xl text-gray-300">Create and deploy your AI agents in minutes with our intuitive platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-16">
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 z-0"></div>

                    {howItWorksSteps.map((step, index) => (
                        <div key={step.id} id={step.id} className="relative z-10">
                            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 h-full">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6 text-white font-bold">{index + 1}</div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-gray-300">{step.description}</p>
                            </div>
                        </div>
                    ))}

                </div>

                <Link
                    href={loginUser?.token ? '/dashboard/agents/chats' : '/sign-up'}
                    className="block w-max text-center mx-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium cursor-pointer"
                >
                    Start Building Your Chatbot
                </Link>
            </div>
        </div>
    )
}
