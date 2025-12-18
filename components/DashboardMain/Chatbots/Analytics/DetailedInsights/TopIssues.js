import { FaEllipsisVertical } from "react-icons/fa6";
import { topIssuesData } from "../constants";
import { Fragment } from "react";
import { FiInbox } from "react-icons/fi";

export default function TopIssues({ isFetching = false, data = [] }) {
    return (
        <section
            id="top-issues"
            className="flex flex-col dark:bg-dark-card-primary bg-light-card-primary shadow rounded-lg border dark:border-dark-border-primary border-light-border-primary p-4"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Issues</h3>
                {/* <button className="text-gray-400 hover:text-white">
                    <FaEllipsisVertical />
                </button> */}
            </div>

            {
                (isFetching)
                    ?
                    <TopIssuesSkeleton />
                    :
                    (data.length === 0)
                        ?
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <FiInbox className="size-8 mb-2 text-secondary" />
                            <p className="text-lg font-[500] text-secondary">
                                No data available.
                            </p>
                        </div>
                        :
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {topIssuesData.map((issue, index) => (
                                <div
                                    key={index}
                                    className="flex items-center"
                                >
                                    <div className="w-full">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">{issue.title}</span>
                                            <span className="text-sm text-gray-400">{issue.value}</span>
                                        </div>
                                        <div className="w-full dark:bg-dark-bg-primary bg-light-bg-primary rounded-full h-2 transition-all duration-1000 ease-in-out">
                                            <div
                                                style={{
                                                    width: issue.value
                                                }}
                                                className="bg-secondary h-2 rounded-full"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
            }

        </section>
    )
}


const TopIssuesSkeleton = ({ count = 6 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center"
                >
                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className="h-2.5 w-10 animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg" />
                            <span className="h-2.5 w-4 animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg" />
                        </div>
                        <div className="h-4 w-full animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    )
}
