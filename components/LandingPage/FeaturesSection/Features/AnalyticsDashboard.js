import dynamic from "next/dynamic";
import DoughnutChart from "@/components/Charts/DoughnutChart";
const LineChart = dynamic(() => import('@/components/Charts/LineChart'), {
    ssr: false,
});
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Link from "next/link";
import { Fragment } from "react";
import { FaArrowUp, FaChartBar, FaChartPie, FaClock, FaComments, FaDownload, FaHeart, FaPlay, FaSmile, FaUsers } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";

export default function AnalyticsDashboard({ lineChartData = {}, doughnutChartData = {} }) {
    const updateQueryParams = useUpdateQueryParams();
    return (
        <Fragment>
            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-6 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    <div className="bg-dark-bg-primary/50 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Total Interactions</h3>
                            <FaComments className=" text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-primary mb-2">24,847</div>
                        <div className="flex items-center text-sm">
                            <FaArrowUp className=" text-green-400 mr-1" />
                            <span className="text-green-400">+12.5%</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-dark-bg-primary/50 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Avg Sentiment</h3>
                            <FaHeart className=" text-secondary" />
                        </div>
                        <div className="text-3xl font-bold text-secondary mb-2">8.4/10</div>
                        <div className="flex items-center text-sm">
                            <FaArrowUp className="text-green-400 mr-1" />
                            <span className="text-green-400">+0.3</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-dark-bg-primary/50 rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Conversion Rate</h3>
                            <FaChartPie className=" text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">18.7%</div>
                        <div className="flex items-center text-sm">
                            <FaArrowUp className="text-green-400 mr-1" />
                            <span className="text-green-400">+2.1%</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-dark-bg-primary/50 rounded-xl p-6 border border-white/5">
                        <h3 className="text-lg font-semibold mb-4">Daily Interactions</h3>
                        <div className="h-[250px]">
                            <LineChart data={lineChartData} valueXField="label" valueYField="value" />
                        </div>
                    </div>


                    <div className="bg-dark-bg-primary/50 rounded-xl p-6 border border-white/5">
                        <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
                        <div className="h-[250px]">
                            <DoughnutChart data={doughnutChartData} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FaChartBar className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Real-time Metrics</h3>
                    <p className="text-gray-300">Monitor live interactions, response times, and user engagement as they happen.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FaSmile className=" text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Sentiment Analysis</h3>
                    <p className="text-gray-300">Track customer emotions and satisfaction levels throughout conversations.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FiTarget className=" text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Conversion Tracking</h3>
                    <p className="text-gray-300">Measure how AI interactions drive sales and customer actions.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FaClock className=" text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Response Analytics</h3>
                    <p className="text-gray-300">Analyze response times, accuracy, and conversation quality metrics.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FaUsers className="text-white size-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">User Journey</h3>
                    <p className="text-gray-300">Visualize complete customer journeys and interaction patterns.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                        <FaDownload className=" text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Export Reports</h3>
                    <p className="text-gray-300">Generate detailed reports and export data for further analysis.</p>
                </div>
            </div>

            <div className="text-center">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Tracking Your Success</h2>
                    <p className="text-xl text-gray-300 mb-8">Get detailed insights into your AI agent's performance and customer satisfaction</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={"/sign-up"}
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                        >
                            View Live Demo
                        </Link>
                        <button
                            onClick={() => { updateQueryParams({ demo: true }) }}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                        >
                            <FaPlay className="mr-2" /> Watch Demo
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
