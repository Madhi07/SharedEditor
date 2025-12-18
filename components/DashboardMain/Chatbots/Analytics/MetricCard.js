import MiniLineChart from "@/components/Charts/MiniLineChart";
import { metricsIcon } from "./constants";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import clsx from "clsx";
import { Fragment } from "react";
import { FiInbox } from "react-icons/fi";

export default function MetricCard({ isFetching = false, title = "", data = {}, selectedFilter = "" }) {
    const newChartData = {
        labels: Array.from({ length: data?.chart_data?.length || 0 }, (_, i) => i),
        datasets: [{
            data: data?.chart_data?.map(item => item?.count ?? item?.average_response_time) || []
        }]
    };

    const content = selectedFilter === "Today" ? "from yesterday" :
        selectedFilter === "Week" ? "from last week" : "from last month";


    return (
        <Fragment>
            {
                (isFetching)
                    ?
                    <MetricCardSkeleton />
                    :
                    <div className="dark:bg-dark-card-primary bg-light-card-primary p-4 rounded-lg border dark:border-dark-border-primary border-light-border-primary shadow">
                        {
                            (Object.values(data).length === 0)
                                ?
                                <div>
                                    <div className="flex justify-between gap-4 mb-4">
                                        <p className="dark:text-dark-text-secondary text-light-text-secondary font-[500] text-sm">{title}</p>
                                        <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                                            {metricsIcon("text-secondary")?.[title]}
                                        </div>
                                    </div>

                                    <div className="mx-auto h-max flex items-center justify-center flex-col">
                                        <FiInbox className="size-8 mb-2 text-secondary" />
                                        <p className="text-lg font-[500] text-secondary text-center">
                                            No data available.
                                        </p>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">{title}</p>
                                            <h3 className="text-2xl font-bold mt-1">
                                                {data?.count ?? `${data?.average_response_time?.toFixed(2)}s` ?? ""}
                                            </h3>
                                            <div className={clsx("flex items-center mt-1",
                                                (data?.trend === "up" || data?.trend === "flat") ? "text-green-500" : "text-red-500")}
                                            >
                                                {data?.trend === "up" ?
                                                    <FaArrowUp className="text-xs mr-1" /> :
                                                    data?.trend === "down" ?
                                                        <FaArrowDown className="text-xs mr-1" /> :
                                                        <span className="mr-1">-</span>
                                                }
                                                <span className="text-sm">
                                                    {`${(data?.rate * 100) + "%"} ${content}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
                                            {metricsIcon("text-secondary")?.[title]}
                                        </div>
                                    </div>
                                    <div className="mt-4 h-12">
                                        <MiniLineChart data={newChartData} />
                                    </div>
                                </Fragment>
                        }

                    </div>
            }

        </Fragment>
    )
}


const MetricCardSkeleton = () => {
    return (

        <div className="dark:bg-dark-card-primary bg-light-card-primary p-4 rounded-lg border dark:border-dark-border-primary border-light-border-primary shadow">
            <div className="flex justify-between items-start">
                <div>
                    <div className="h-4 w-20 animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-10 animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg mt-1" />
                    <div className="h-4 w-32 animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg mt-1" />

                </div>
                <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-10 animate-pulse" />
            </div>
            <div className="h-10 w-full animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg mt-4" />
        </div>

    )
}
