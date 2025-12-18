import dynamic from 'next/dynamic';
import { FaChartLine } from 'react-icons/fa';
import { FiInbox } from 'react-icons/fi';
const LineChart = dynamic(() => import('@/components/Charts/LineChart'), {
    ssr: false,
});

export default function RecentTrends({ isFetching = false, data = [] }) {

    // Convert string timestamps to Date objects
    const chartData = data.map(item => ({
        timestamp: new Date(item.timestamp).getTime(),
        count: item.count,
    }));



    return (
        <section
            id="recent-trends"
            className="flex flex-col dark:bg-dark-card-primary bg-light-card-primary rounded-lg shadow border dark:border-dark-border-primary border-light-border-primary p-4"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Trends</h3>
                {/* <div className="flex space-x-2">
                    <button className="px-2 py-1 text-xs rounded dark:bg-dark-bg-primary bg-light-bg-primary text-gray-300">7d</button>
                    <button className="px-2 py-1 text-xs rounded bg-primary text-white">30d</button>
                    <button className="px-2 py-1 text-xs rounded dark:bg-dark-bg-primary bg-light-bg-primary text-gray-300">90d</button>
                </div> */}
            </div>
            <div className="flex-1">
                {
                    (isFetching)
                        ?
                        <RecentTrendsSkeleton />
                        :
                        (data.length === 0)
                            ?
                            <div className="h-full w-full flex flex-col items-center justify-center">
                                <FiInbox className="size-8 mb-2 text-secondary" />
                                <p className="text-lg font-[500] text-secondary">
                                    No data available.
                                </p>
                            </div>
                            :
                            <div className='w-full h-[250px]'>
                                <LineChart
                                    data={chartData}
                                    valueXField='timestamp'
                                    valueYField='count'
                                    xAxisType={"date"}
                                />
                            </div>
                }

            </div>
        </section>
    )
}


const RecentTrendsSkeleton = () => {
    return (
        <div className='flex w-full h-full items-center justify-center'>
            <FaChartLine className='h-1/2 w-1/2 animate-pulse dark:text-gray-800 text-gray-200' />
        </div>
    )
}