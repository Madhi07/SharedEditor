import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PageTracker = ({ userId, sendPageData }) => {
    const router = useRouter();
    const [startTime, setStartTime] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);

    // Function to send page data to backend
    const sendPageDataToBackend = (url, timeSpent) => {

        // PUST

        let bodyData = {}
        bodyData['method'] = "PATCH"
        bodyData['time_spent'] = timeSpent / 1000
        bodyData['view_time'] = startTime?.toISOString()
        if (userId) {
            bodyData['user'] = userId

        }
        sendPageData({ ...bodyData });

    };

    useEffect(() => {
        // Check if start time exists in localStorage (handle hard reload)
        const storedStartTime = localStorage.getItem("pageStartTime");
        const storedPage = localStorage.getItem("currentPage");

        // Only set initial start time if it's not already set
        if (!storedStartTime || !storedPage) {
            const initialStartTime = new Date();
            localStorage.setItem("pageStartTime", initialStartTime.toISOString());
            localStorage.setItem("currentPage", window.location.href);
            setStartTime(initialStartTime);
            setCurrentPage(window.location.href);
        } else {
            setStartTime(new Date(storedStartTime));
            setCurrentPage(storedPage);
        }

        const handleRouteChange = (url) => {



            // Send data for the last page before switching to the new page
            if (currentPage && startTime) {
                const endTime = new Date();
                const timeSpent = endTime - startTime;
                sendPageDataToBackend(currentPage, timeSpent);
            }

            // Only update state if the page URL has changed
            if (url !== currentPage) {
                localStorage.setItem("pageStartTime", new Date().toISOString());
                localStorage.setItem("currentPage", url);
                setStartTime(new Date());
                setCurrentPage(url);
            }
        };

        // Add event listener for route changes
        router.events.on("routeChangeStart", handleRouteChange);

        // Cleanup on unmount
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router.events, currentPage, userId]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            // Send data for the current page before unload
            if (currentPage && startTime) {
                const endTime = new Date();
                const timeSpent = endTime - startTime;
                sendPageDataToBackend(currentPage, timeSpent);
            }
        };

        // Listen for tab/window close or refresh
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Cleanup event listener
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentPage, startTime, userId]);

    return null;
};

export default PageTracker;
