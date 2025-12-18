import { useRouter } from "next/router";
import IntegrationsSection from "./IntegrationsSection";
import ChatsSection from "./ChatsSection";
import DashboardSection from "./DashboardSection";
import DashboardSectionNew from "./DashboardSection/ChartComponent";
import WorkflowDashboard from "./workflow/WorkflowDashboard";
import Workflow from "./workflow";

export default function AgentsSection() {
    const router = useRouter();

    const secondPath = `/${router?.query?.index?.[1]}`;
    return (
        <div className="w-full h-full transition-all duration-300 overflow-hidden relative flex">
            <div className="flex-1 overflow-hidden">
                {(secondPath === "/integrations") && (
                    <IntegrationsSection />
                )}               
                {(secondPath === "/chats") && (
                    <ChatsSection />
                )}                
                {(secondPath === "/dashboard") && (
                    <DashboardSectionNew />
                )}
                {(secondPath === "/workflow") && (
                    <Workflow />
                )}                
            </div>
        </div>
    )
}
