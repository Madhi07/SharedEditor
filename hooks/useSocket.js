import { useState, useRef, useCallback, useEffect } from "react";

export default function useSocket() {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [socketData, setSocketData] = useState(null);

    const connect = useCallback((url) => {
        return new Promise((resolve, reject) => {
            if (socketRef.current) {
                console.warn("🔁 Closing previous socket before reconnecting");
                socketRef.current.close();
            }

            const socket = new WebSocket(url);
            socketRef.current = socket;

            socket.onopen = () => {
                setConnected(true);
                console.log("✅ Connected →", url);
                resolve(true);
            };

            socket.onmessage = (event) => {
                try {
                    console.log("data......................", event.data)
                    const data = JSON.parse(event.data);
                    setSocketData(data);
                } catch {
                    console.error("❌ Failed to parse:", event.data);
                }
            };

            socket.onerror = (err) => {
                console.error("❌ WebSocket error:", err);
                reject(err);
            };

            socket.onclose = () => {
                setConnected(false);
                console.log("🔌 Disconnected →", url);
            };
        });
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setConnected(false);
            setSocketData(null);
        }
    }, []);

    const sendMessage = useCallback((data) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(data);
        } else {
            console.warn("⚠️ WebSocket not open");
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);

    return { connect, disconnect, sendMessage, socketData, connected };
}
