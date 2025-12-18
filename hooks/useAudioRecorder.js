import { useRef, useState, useCallback } from "react";

export default function useAudioRecorder(sendMessage, connected) {
    const [isRecording, setIsRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const streamInfoRef = useRef(null);

    const startRecording = useCallback(async () => {
        if (isRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            await audioContext.resume();
            const sourceNode = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            // Send sample rate to server
            sendMessage(JSON.stringify({ event: "config", sampleRate: audioContext.sampleRate }));

            let started = false;
            let silenceCounter = 0;
            const silenceThreshold = 0.01;
            const maxSilenceFrames = 25;

            processor.onaudioprocess = (e) => {
                const input = e.inputBuffer.getChannelData(0);
                let sum = 0;
                for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
                const rms = Math.sqrt(sum / input.length);

                if (rms > silenceThreshold) {
                    started = true;
                    silenceCounter = 0;
                    if (!isListening) setIsListening(true);
                } else if (started) {
                    silenceCounter++;
                    if (silenceCounter > maxSilenceFrames) {
                        started = false;
                        setIsListening(false);
                    }
                }

                // if (started) {
                // Convert to Int16 PCM and base64
                const pcm16 = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) {
                    const s = Math.max(-1, Math.min(1, input[i]));
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                }
                sendMessage(pcm16.buffer);
                // }
            };

            sourceNode.connect(processor);
            processor.connect(audioContext.destination);

            streamInfoRef.current = { stream, audioContext, processor, sourceNode };
            setIsRecording(true);
            setIsListening(false);
        } catch (err) {
            console.error("❌ Failed to start recording:", err);
        }
    }, [isRecording, sendMessage]);

    const stopRecording = useCallback(() => {
        if (!isRecording) return;

        const info = streamInfoRef.current;
        if (info) {
            info.stream.getTracks().forEach((t) => t.stop());
            info.processor.disconnect();
            info.sourceNode.disconnect();
            info.audioContext.close();
            streamInfoRef.current = null;
        }

        setIsRecording(false);
        setIsListening(false);
    }, [isRecording]);

    return { isRecording, isListening, startRecording, stopRecording };
}
