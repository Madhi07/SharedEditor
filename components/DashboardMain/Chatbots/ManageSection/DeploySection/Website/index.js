import { useRouter } from "next/router";
import { useState } from "react";
import { FaCheck, FaCopy, FaGlobe } from "react-icons/fa";

export default function WebsiteSection() {

    const router = useRouter();

    const [widgetCopied, setWidgetCopied] = useState(false);

    const handleCopyWidget = () => {
        navigator.clipboard.writeText(
            `<script src="${process.env.WIDGET_SCRIPT_URL}?agentId=${router?.query?.id}"></script>`
        );

        setWidgetCopied(true);

        setTimeout(() => setWidgetCopied(false), 2000);
    }

    return (
        <div className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaGlobe className="flex-shrink-0 size-5" />
                <h3 className="text-xl font-medium">
                    Website
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">

                <h4 className="font-medium mb-4">Installation Code</h4>
                <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-4">Copy and paste this code into your website's HTML, just inside the &lt;head&gt; tag</p>

                <div className="bg-light-bg-primary rounded-lg p-4 border dark:border-dark-border-primary border-light-border-primary relative">
                    <pre className="text-sm dark:text-dark-text-secondary text-light-text-secondary font-[600] text-wrap">
                        <code>&lt;script src={`"${process.env.WIDGET_SCRIPT_URL}?agentId=${router?.query?.id}"`}&gt;&lt;/script&gt;</code>
                    </pre>
                    <button
                        onClick={handleCopyWidget}
                        type="button"
                        className="absolute top-3 right-3 dark:text-dark-text-secondary text-light-text-secondary hover:!text-secondary"
                    >
                        {widgetCopied ? (
                            <FaCheck className="text-green-400" />
                        ) : (
                            <FaCopy />
                        )
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}
