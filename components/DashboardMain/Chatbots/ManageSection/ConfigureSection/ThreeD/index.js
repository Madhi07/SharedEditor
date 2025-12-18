import { AgentZeeHead } from "@/components/SVG";
import FunctionalPanel from "./FunctionalPanel";
import LivePreview from "./LivePreview";

export default function ThreeDSection({ formMessages = {}, setFormMessages }) {
    return (
        <div id="platform-3d" className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <AgentZeeHead className="flex-shrink-0 size-5" />
                <h3 className="text-xl font-medium">
                    3D
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">
                <div className="grid grid-cols-1 2xl:grid-cols-5 2xl:gap-x-6 gap-y-6">
                    <FunctionalPanel
                        formMessages={formMessages}
                        setFormMessages={setFormMessages}
                    />
                    <LivePreview />
                </div>
            </div>
        </div>
    )
}
