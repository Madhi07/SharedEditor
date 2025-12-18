import { FaGlobe } from "react-icons/fa";
import FunctionalPanel from "./FunctionalPanel";
import LivePreview from "./LivePreview";

export default function WebsiteSection({ formMessages = {}, setFormMessages }) {
    return (
        <div id="platform-website" className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaGlobe className="flex-shrink-0 size-5" />
                <h3 className="text-xl font-medium">
                    Website
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
