import { AgentZeeHead } from "@/components/SVG";
import { useAuthContext } from "@/context/useAuthContext";
import Link from "next/link";
import { Fragment } from "react";
import { FaChartLine, FaComments, FaLock } from "react-icons/fa";

const features = [
    { icon: FaChartLine, label: "Advanced Dashboard Analytics" },
    { icon: FaComments, label: "Full Chat History" },
    { icon: AgentZeeHead, label: "Agent Customization" },
];

export default function FeatureGate({ children }) {

    const { loginUser } = useAuthContext();

    if (!loginUser) return;

    if (!loginUser?.user_plan || loginUser?.user_plan === "free") {
        return (
            <div id="upgrade-modal" className="w-full h-full p-4 lg:p-8 overflow-hidden flex flex-col items-center justify-center">
                <div className="max-w-lg mx-auto w-full">

                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/50 to-secondary/5 flex items-center justify-center">
                            <FaLock className=" text-3xl text-secondary" />
                        </div>


                        <h2 className="text-2xl font-bold mb-3">Upgrade to Unlock Premium Features</h2>


                        <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm leading-relaxed font-[500]">
                            You're currently on the Free Plan. Upgrade to access advanced dashboard insights,
                            full chat history, and powerful agent management tools.
                        </p>
                    </div>


                    <div className="dark:bg-dark-card-primary bg-light-card-primary rounded-xl border dark:border-dark-border-primary border-light-border-primary p-6 mb-8">
                        <div className="space-y-4">
                            {features.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <item.icon className="text-sm text-secondary" />
                                    </div>
                                    <span className="dark:text-dark-text-secondary text-light-text-secondary text-sm">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="text-center">
                        <Link
                            href={"/dashboard/settings?tab=billing"}
                            id="upgrade-btn"
                            className="w-full block bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
