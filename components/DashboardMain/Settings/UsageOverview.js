import { useAuthContext } from "@/context/useAuthContext";
import { format, parseISO } from "date-fns";
import { Fragment } from "react";
import { FaCalendar, FaCheck, FaPlug } from "react-icons/fa";

export default function UsageOverview() {

    const { loginUser } = useAuthContext();

    return (
        <Fragment>
            {/* <div id="api-calls-card" className="dark:bg-dark-card-primary bg-light-card-primary p-4 rounded-lg border dark:border-dark-border-primary border-light-border-primary">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">API Calls</p>
                        <h4 className="text-xl font-bold">3,500</h4>
                        <p className="text-xs dark:text-dark-text-secondary/90 text-light-text-secondary/90">of 10,000</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <FaPlug className=" text-primary" />
                    </div>
                </div>
                <div className="w-full dark:bg-dark-bg-primary bg-light-bg-primary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[35%]"></div>
                </div>
            </div> */}

            <div id="billing-card" className="dark:bg-dark-card-primary bg-light-card-primary p-4 rounded-lg border dark:border-dark-border-primary border-light-border-primary">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">Next Billing</p>
                        <h4 className="text-lg font-bold">
                            {(loginUser?.next_billing_cycle_date instanceof String) ?
                                `${format(parseISO(loginUser?.next_billing_cycle_date), "LLLL do, yyyy h:mm a")}` :
                                ""
                            }
                        </h4>
                        <p className="text-xs dark:text-dark-text-secondary/90 text-light-text-secondary/90">Auto-renewal</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <FaCalendar className="text-primary" />
                    </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-green-500">
                    <FaCheck className=" mr-1" />
                    Auto-pay enabled
                </div>
            </div>
        </Fragment>
    )
}
