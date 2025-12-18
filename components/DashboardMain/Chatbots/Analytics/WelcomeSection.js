import { FaDownload } from "react-icons/fa";
import { filterRanges } from "./constants";
import clsx from "clsx";
import { useAuthContext } from "@/context/useAuthContext";

export default function WelcomeSection({ selectedFilter = "", onFilterClick }) {
    const { loginUser } = useAuthContext();
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between">
            {/* <div>
                <h2 className="text-2xl font-bold">Welcome back, {loginUser?.first_name} {loginUser?.last_name}!</h2>
                <p className="text-gray-400 mt-1">Here's what's happening with your chatbot today.</p>
            </div> */}
            <div className="mt-4 ml-auto md:mt-0 flex">
                <div className="inline-flex rounded-md shadow-sm">
                    {filterRanges.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onFilterClick(item)}
                            className={clsx("px-4 py-2 text-inherit border-x-0 border-l text-sm  border dark:border-dark-border-primary border-light-border-primary",
                                index === 0 && "rounded-l-md",
                                ((index + 1) === filterRanges.length) && "rounded-r-md border-r",
                                selectedFilter === item ? "from-primary to-secondary bg-gradient-to-r font-[500] text-white" : "dark:bg-dark-card-primary bg-light-card-primary dark:hover:bg-dark-bg-primary hover:bg-light-bg-primary"
                            )}
                        >
                            {item}
                        </button>
                    ))}

                </div>
                <button className="ml-2 px-4 py-2 text-sm font-medium rounded-md from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r text-white hover:bg-opacity-90 flex items-center">
                    <FaDownload className=" mr-1" /> Export
                </button>
            </div>
        </div>
    )
}
