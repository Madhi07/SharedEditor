import { Fragment, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import clsx from "clsx";
import { useDashboardContext } from "@/context/useDashboardContext";
import { useRouter } from "next/router";

export default function Stepper({ selectedStep }) {

    const router = useRouter();
    const { chatbotStepper } = useDashboardContext();


    return (
        <div className="flex justify-between">
            {chatbotStepper?.map((step, index) => (
                <Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        {step.completed ?
                            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center",
                                (selectedStep === step.id) ? "bg-primary" : "from-primary to-secondary bg-gradient-to-r"
                            )}>
                                <FaCheck className="text-white" />
                            </div> :
                            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-[600]",
                                (selectedStep === step.id) ? "bg-primary text-white" : 'text-primary border-2 border-primary',
                            )}>
                                {index + 1}
                            </div>
                        }
                        <span className={clsx("text-xs mt-2 dark:text-dark-text-secondary text-light-text-secondary",
                            (selectedStep === step.id) && "font-[600]"
                        )}>
                            {step.name}
                        </span>
                    </div>
                    {(chatbotStepper?.length !== index + 1) &&
                        <div className="flex-1 flex items-center mx-2">
                            <div className={clsx("h-1 w-full rounded bg-gradient-to-r",
                                step.completed ? 'from-primary to-secondary' : 'bg-gray-600'
                            )}></div>
                        </div>
                    }
                </Fragment>
            ))}
        </div>
    )
}
