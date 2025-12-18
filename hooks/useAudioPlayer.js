import { useRef, useState, useCallback } from "react";

export function useAudioPlayer() {
    const audioCtxRef = useRef(null);
    const nextPlayTime = useRef(0);
    const queueRef = useRef([]);
    const sourceRef = useRef(null);

    const isPlayingRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const graceTimeoutRef = useRef(null);

    // 🆕 this is the playback reference
    const referenceTimestamp = useRef(null);

    if (!audioCtxRef.current && typeof window !== "undefined") {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const decodeChunk = (base64Audio) => {
        const audioCtx = audioCtxRef.current;
        const pcmBytes = Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0));
        const buffer = audioCtx.createBuffer(1, pcmBytes.length / 2, 22050);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < channelData.length; i++) {
            const lo = pcmBytes[i * 2];
            const hi = pcmBytes[i * 2 + 1];
            const sample = (hi << 8) | lo;
            const int16 = sample >= 0x8000 ? sample - 0x10000 : sample;
            channelData[i] = int16 / 32768;
        }

        return buffer;
    };

    const enqueueChunk = useCallback((base64Audio) => {
        const buffer = decodeChunk(base64Audio);
        queueRef.current.push(buffer);

        if (!isPlayingRef.current) {
            isPlayingRef.current = true;
            setIsPlaying(true);

            // 🆕 mark when playback starts
            referenceTimestamp.current = audioCtxRef.current.currentTime;

            play();
        }
    }, []);

    const play = useCallback(() => {
        const audioCtx = audioCtxRef.current;
        if (!audioCtx || queueRef.current.length === 0) return;

        const playNext = () => {
            if (queueRef.current.length === 0) {
                clearTimeout(graceTimeoutRef.current);
                graceTimeoutRef.current = setTimeout(() => {
                    if (queueRef.current.length === 0) {
                        isPlayingRef.current = false;
                        setIsPlaying(false);
                        nextPlayTime.current = 0;
                        referenceTimestamp.current = null; // 🆕 reset reference
                    } else {
                        playNext();
                    }
                }, 200);
                return;
            }

            const buffer = queueRef.current.shift();
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);

            if (!nextPlayTime.current || nextPlayTime.current < audioCtx.currentTime + 0.05) {
                nextPlayTime.current = audioCtx.currentTime + 0.05;
            }

            // 🆕 Mark the actual scheduled start time for lipsync
            if (!referenceTimestamp.current) {
                referenceTimestamp.current = nextPlayTime.current + 0.03;
            }

            source.start(nextPlayTime.current);
            nextPlayTime.current += buffer.duration;
            sourceRef.current = source;

            source.onended = playNext;
        };

        playNext();
    }, []);

    const stop = useCallback(() => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch { }
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        queueRef.current = [];
        clearTimeout(graceTimeoutRef.current);

        nextPlayTime.current = 0;
        referenceTimestamp.current = null; // 🆕 reset reference
        isPlayingRef.current = false;
        setIsPlaying(false);
    }, []);

    const endStream = useCallback(() => {
        clearTimeout(graceTimeoutRef.current);
        graceTimeoutRef.current = setTimeout(() => {
            if (queueRef.current.length === 0) {
                isPlayingRef.current = false;
                setIsPlaying(false);
                nextPlayTime.current = 0;
                referenceTimestamp.current = null; // 🆕 reset reference
            }
        }, 200);
    }, []);

    return {
        enqueueChunk,
        stop,
        endStream,
        isPlaying,
        audioCtxRef,
        nextPlayTime,
        referenceTimestamp // 🆕 expose reference
    };
}
