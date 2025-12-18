import { FaCheckCircle, FaClock, FaComments, FaStar } from "react-icons/fa";

export const metricsIcon = (className = "") => ({
    "Total Chats": <FaComments className={className} />,
    "Customer Leads": <FaCheckCircle className={className} />,
    "Average Response Time": <FaClock className={className} />,
    "Customer Satisfaction": <FaStar className={className} />
});

export const topIssuesData = [
    {
        title: "Account Login",
        value: "32%"
    },
    {
        title: "Payment Processing",
        value: "28%"
    },
    {
        title: "Product Information",
        value: "18%"
    },
    {
        title: "Order Status",
        value: "12%"
    },
    {
        title: "Return Policy",
        value: "10%"
    }
];

export const recentTrendsData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Sep'],
    datasets: [
        {
            label: 'Total Chats',
            data: [45000, 52000, 49000, 61000, 68000, 71000]
        },
        // {
        //     label: 'Resolved Chats',
        //     data: [38000, 45000, 41000, 53000, 60000, 64000]
        // }
    ]
};

export const filterRanges = ['Today', "Week", "Month", "All"];