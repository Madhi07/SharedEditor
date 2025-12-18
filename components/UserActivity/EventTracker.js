import { useEffect } from "react";

export default function EventTracker({ sendEventToBackend }) {
    useEffect(() => {
        const trackEvent = (event) => {
            const eventData = {
                page_view: "1", // Replace with dynamic page view ID
                action_type: event.type, // Dynamic event type
                action_target: event.target.tagName || null,
                // action_target: event.target?.id || event.target?.className || null,
                action_data: {
                    x: event.clientX || null,
                    y: event.clientY || null,
                    value: event.target?.value || null,
                    tag: event.target.outerHTML,
                },

                timestamp: new Date().toISOString(),
            };
            
            let user_id = localStorage.getItem("user_id");
            if (user_id) {
                eventData['user'] = user_id;
            }
            
            if (sendEventToBackend) {
                sendEventToBackend(eventData);
            }
        };



        // List of events to track
        const events = [
            "click",
            // "scroll",
            // "keydown",
            // // "keyup",
            // "submit",
            // "change",
            // "input",
            // "resize",
            // "touchstart",
            // "touchmove",
            // "touchend",
            // "focus",
            // "blur",
        ];

        // Add event listeners
        events.forEach((event) => document.addEventListener(event, trackEvent));

        // Cleanup event listeners on component unmount
        return () => {
            events.forEach((event) => document.removeEventListener(event, trackEvent));
        };
    }, []);

    return null;
}